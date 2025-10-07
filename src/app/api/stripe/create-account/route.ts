import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCurrentUser } from '@/lib/auth';
import { userAccountMap } from '../account/route';

// Initialize Stripe only if the secret key is available
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover'
}) : null;

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { email, type = 'express' } = body;

    // Check if user already has a Stripe account
    const existingAccountId = userAccountMap.get(user.id) || user.stripeAccountId;
    if (existingAccountId) {
      try {
        const existingAccount = await stripe.accounts.retrieve(existingAccountId);
        return NextResponse.json({ 
          account: {
            id: existingAccount.id,
            detailsSubmitted: existingAccount.details_submitted,
            chargesEnabled: existingAccount.charges_enabled,
            payoutsEnabled: existingAccount.payouts_enabled,
            requirements: existingAccount.requirements,
            capabilities: existingAccount.capabilities
          },
          success: true 
        });
      } catch (stripeError) {
        // Account was deleted, remove from store and create a new one
        userAccountMap.delete(user.id);
        console.log('Previous account not found, creating new one');
      }
    }

    // Determine business type based on user type
    const businessType = user.userType === 'TCG Store' ? 'company' : 'individual';

    // Create Stripe Express account for receiving payouts only
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US', // You can make this dynamic based on user location
      email: email || user.email,
      capabilities: {
        transfers: { requested: true }
      },
      business_type: businessType,
      settings: {
        payouts: {
          schedule: {
            interval: 'daily'
          }
        }
      },
      // Add business information if it's a TCG Store
      ...(businessType === 'company' && user.storeName && {
        company: {
          name: user.storeName
        }
      })
    });

    // Save account ID to our simple store (replace with database in production)
    userAccountMap.set(user.id, account.id);
    console.log('Created Stripe account:', account.id, 'for user:', user.id);

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
    console.error('Error creating Stripe account:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}