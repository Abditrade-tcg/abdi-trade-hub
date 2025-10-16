import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { fromSSO } from '@aws-sdk/credential-provider-sso';

// Initialize DynamoDB client
// For local development, this will use AWS SSO credentials from the abditrade-admin profile
// For production, set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-2',
  credentials: process.env.NODE_ENV === 'production' && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : fromSSO({ profile: 'abditrade-admin' }),
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'abditrade-main';

// Entity types
export const EntityTypes = {
  GUILD: 'GUILD',
  POST: 'POST',
  COMMENT: 'COMMENT',
  MEMBER: 'MEMBER',
  LIKE: 'LIKE',
} as const;

// Guild Operations
export const guildDB = {
  async create(guild: {
    name: string;
    description: string;
    category: string;
    isPrivate: boolean;
    createdBy: string;
    rules?: string;
    image?: string;
  }) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const item = {
      PK: `GUILD#${id}`,
      SK: `METADATA`,
      EntityType: EntityTypes.GUILD,
      id,
      name: guild.name,
      description: guild.description,
      category: guild.category,
      isPrivate: guild.isPrivate,
      rules: guild.rules || '',
      image: guild.image || '🎮',
      createdBy: guild.createdBy,
      createdAt: now,
      updatedAt: now,
      members: 1,
      posts: 0,
      trending: false,
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));

    // Add creator as first member
    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `GUILD#${id}`,
        SK: `MEMBER#${guild.createdBy}`,
        EntityType: EntityTypes.MEMBER,
        guildId: id,
        userId: guild.createdBy,
        role: 'creator',
        joinedAt: now,
      },
    }));

    return item;
  },

  async getById(guildId: string) {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `GUILD#${guildId}`,
        SK: 'METADATA',
      },
    }));

    return result.Item;
  },

  async list(limit = 50) {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'EntityType = :type',
      ExpressionAttributeValues: {
        ':type': EntityTypes.GUILD,
      },
      Limit: limit,
    }));

    return result.Items || [];
  },

  async update(guildId: string, updates: Record<string, string | number | boolean>) {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, string | number | boolean> = {};

    Object.entries(updates).forEach(([key, value], index) => {
      updateExpressions.push(`#attr${index} = :val${index}`);
      expressionAttributeNames[`#attr${index}`] = key;
      expressionAttributeValues[`:val${index}`] = value;
    });

    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `GUILD#${guildId}`,
        SK: 'METADATA',
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    }));
  },

  async incrementPostCount(guildId: string) {
    await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `GUILD#${guildId}`,
        SK: 'METADATA',
      },
      UpdateExpression: 'ADD posts :inc SET updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':updatedAt': new Date().toISOString(),
      },
    }));
  },

  async incrementMemberCount(guildId: string) {
    await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `GUILD#${guildId}`,
        SK: 'METADATA',
      },
      UpdateExpression: 'ADD members :inc SET updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':updatedAt': new Date().toISOString(),
      },
    }));
  },
};

// Post Operations
export const postDB = {
  async create(post: {
    guildId: string;
    content: string;
    authorId: string;
    authorName: string;
    postType?: string;
    card?: {
      id: string;
      name: string;
      game: string;
      set?: string;
      image?: string;
      price?: string;
    } | null;
  }) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const item = {
      PK: `GUILD#${post.guildId}`,
      SK: `POST#${now}#${id}`,
      EntityType: EntityTypes.POST,
      id,
      guildId: post.guildId,
      content: post.content,
      authorId: post.authorId,
      authorName: post.authorName,
      postType: post.postType || 'Discussion',
      card: post.card || null,
      likes: 0,
      comments: 0,
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));

    // Increment guild post count
    await guildDB.incrementPostCount(post.guildId);

    return item;
  },

  async getByGuild(guildId: string, limit = 50) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `GUILD#${guildId}`,
        ':sk': 'POST#',
      },
      ScanIndexForward: false, // Most recent first
      Limit: limit,
    }));

    return result.Items || [];
  },

  async getById(guildId: string, postId: string) {
    // We need to scan because we don't have the full SK (which includes timestamp)
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      FilterExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':pk': `GUILD#${guildId}`,
        ':sk': 'POST#',
        ':id': postId,
      },
      Limit: 1,
    }));

    return result.Items?.[0];
  },

  async delete(pk: string, sk: string) {
    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: pk,
        SK: sk,
      },
    }));
  },

  async togglePin(pk: string, sk: string, currentPinState: boolean) {
    await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: pk,
        SK: sk,
      },
      UpdateExpression: 'SET isPinned = :pinned, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':pinned': !currentPinState,
        ':updatedAt': new Date().toISOString(),
      },
    }));
  },

  async incrementLikes(guildId: string, postId: string) {
    // First find the post to get its SK
    const post = await this.getById(guildId, postId);
    if (!post) return;

    await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: post.PK,
        SK: post.SK,
      },
      UpdateExpression: 'ADD likes :inc SET updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':updatedAt': new Date().toISOString(),
      },
    }));
  },

  async decrementLikes(guildId: string, postId: string) {
    // First find the post to get its SK
    const post = await this.getById(guildId, postId);
    if (!post) return;

    await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: post.PK,
        SK: post.SK,
      },
      UpdateExpression: 'ADD likes :dec SET updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':dec': -1,
        ':updatedAt': new Date().toISOString(),
      },
    }));
  },

  async incrementComments(guildId: string, postId: string) {
    // First find the post to get its SK
    const post = await this.getById(guildId, postId);
    if (!post) return;

    await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: post.PK,
        SK: post.SK,
      },
      UpdateExpression: 'ADD comments :inc SET updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':updatedAt': new Date().toISOString(),
      },
    }));
  },
};

// Like Operations
export const likeDB = {
  async toggle(guildId: string, postId: string, userId: string) {
    const pk = `GUILD#${guildId}#POST#${postId}`;
    const sk = `LIKE#${userId}`;

    // Check if like exists
    const existing = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
    }));

    if (existing.Item) {
      // Unlike
      await docClient.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { PK: pk, SK: sk },
      }));
      return { liked: false };
    } else {
      // Like
      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          PK: pk,
          SK: sk,
          EntityType: EntityTypes.LIKE,
          guildId,
          postId,
          userId,
          createdAt: new Date().toISOString(),
        },
      }));
      return { liked: true };
    }
  },

  async check(guildId: string, postId: string, userId: string) {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `GUILD#${guildId}#POST#${postId}`,
        SK: `LIKE#${userId}`,
      },
    }));

    return !!result.Item;
  },

  async getPostLikes(guildId: string, postId: string) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `GUILD#${guildId}#POST#${postId}`,
        ':sk': 'LIKE#',
      },
    }));

    return result.Items || [];
  },
};

// Comment Operations
export const commentDB = {
  async create(comment: {
    guildId: string;
    postId: string;
    content: string;
    authorId: string;
    authorName: string;
  }) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const item = {
      PK: `GUILD#${comment.guildId}#POST#${comment.postId}`,
      SK: `COMMENT#${now}#${id}`,
      EntityType: EntityTypes.COMMENT,
      id,
      guildId: comment.guildId,
      postId: comment.postId,
      content: comment.content,
      authorId: comment.authorId,
      authorName: comment.authorName,
      createdAt: now,
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));

    return item;
  },

  async getByPost(guildId: string, postId: string, limit = 100) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `GUILD#${guildId}#POST#${postId}`,
        ':sk': 'COMMENT#',
      },
      ScanIndexForward: false, // Most recent first
      Limit: limit,
    }));

    return result.Items || [];
  },
};

// Member Operations
export const memberDB = {
  async add(guildId: string, userId: string) {
    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `GUILD#${guildId}`,
        SK: `MEMBER#${userId}`,
        EntityType: EntityTypes.MEMBER,
        guildId,
        userId,
        role: 'member',
        joinedAt: new Date().toISOString(),
      },
    }));

    await guildDB.incrementMemberCount(guildId);
  },

  async remove(guildId: string, userId: string) {
    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `GUILD#${guildId}`,
        SK: `MEMBER#${userId}`,
      },
    }));
  },

  async getByGuild(guildId: string) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `GUILD#${guildId}`,
        ':sk': 'MEMBER#',
      },
    }));

    return result.Items || [];
  },

  async check(guildId: string, userId: string) {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `GUILD#${guildId}`,
        SK: `MEMBER#${userId}`,
      },
    }));

    return !!result.Item;
  },
};

export { docClient, TABLE_NAME };
