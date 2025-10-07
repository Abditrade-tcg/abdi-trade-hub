import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCurrentUser } from '@/lib/auth';

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
    const { 
      accountId, 
      refreshUrl, 
      returnUrl, 
      type = 'embedded' 
    } = body;

    if (!accountId || !refreshUrl || !returnUrl) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Always create embedded onboarding session as per requirements
    const accountSession = await stripe.accountSessions.create({
      account: accountId,
      components: {
        account_onboarding: {
          enabled: true,
          features: {
            external_account_collection: true
          }
        }
      }
    });

    return NextResponse.json({
      session: {
        accountId: accountId,
        clientSecret: accountSession.client_secret,
        type: 'embedded',
        expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour from now
      },
      success: true
    });

  } catch (error) {
    console.error('Error creating onboarding session:', error);
    return NextResponse.json(
      { error: 'Failed to create onboarding session' },
      { status: 500 }
    );
  }
}