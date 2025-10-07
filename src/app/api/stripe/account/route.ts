import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCurrentUser } from '@/lib/auth';

// Initialize Stripe only if the secret key is available
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover'
}) : null;

// Simple in-memory store for development (replace with database in production)
export const userAccountMap = new Map<string, string>();

export async function GET(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has a Stripe account ID (from our simple store or user data)
    const stripeAccountId = userAccountMap.get(user.id) || user.stripeAccountId;

    if (!stripeAccountId) {
      return NextResponse.json({ account: null });
    }

    try {
      const account = await stripe.accounts.retrieve(stripeAccountId);

      return NextResponse.json({ 
        account: {
          id: account.id,
          detailsSubmitted: account.details_submitted,
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
          requirements: account.requirements,
          capabilities: account.capabilities
        },
        success: true
      });
    } catch (error) {
      console.error('Error retrieving Stripe account:', error);
      // Account might have been deleted, remove from our store
      userAccountMap.delete(user.id);
      return NextResponse.json({ account: null });
    }

  } catch (error) {
    console.error('Error checking Stripe account:', error);
    return NextResponse.json(
      { error: 'Failed to check account' },
      { status: 500 }
    );
  }
}