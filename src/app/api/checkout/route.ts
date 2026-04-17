import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@/cf-helpers';
import Stripe from 'stripe';
import { auth } from '@/auth';


export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { env } = getRequestContext() as unknown as { env: any };
    const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2024-12-18.acacia' as any,
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Create a dynamic price checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      client_reference_id: session.user.id,
      customer_email: session.user.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 1500, // $15.00/month
            recurring: { interval: 'month' },
            product_data: {
              name: 'NextAgent Pro',
              description: 'Unlock 500 questions/day and Claude 3.5 Sonnet / GPT-4o access.',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${new URL(req.url).origin}/app?success=true`,
      cancel_url: `${new URL(req.url).origin}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error('Checkout err:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
