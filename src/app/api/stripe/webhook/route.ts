import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Important: Next.js reads raw body differently in App Router for webhooks
// But we actually need to bypass default parsing for stripe webhook signature
export const config = {
  api: {
    bodyParser: false,
  },
};

// We use the admin Supabase client here because this webhook runs server-side
// WITHOUT a user session context, so standard RLS block us from updating another user's profile.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // A payment was successful
        if (session.mode === 'subscription') {
          await supabaseAdmin
            .from('profiles')
            .update({
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              plan_type: 'pro',
            })
            .eq('id', session.client_reference_id);
            
            console.log(`[Stripe Webhook] Upgraded user ${session.client_reference_id} to PRO`);
        }
        break;

      case 'customer.subscription.updated':
        // Example: Subscription renewed or cancelled (but active till end of period)
        const subscriptionUpdated = await stripe.subscriptions.retrieve(session.id);
        
        let planType = 'pro';
        if (subscriptionUpdated.status === 'canceled' || subscriptionUpdated.status === 'unpaid') {
           planType = 'free';
        }

        await supabaseAdmin
            .from('profiles')
            .update({
                plan_type: planType,
                plan_expires_at: new Date(subscriptionUpdated.current_period_end * 1000).toISOString(),
            })
            .eq('stripe_subscription_id', session.id);
            
        console.log(`[Stripe Webhook] Updated subscription for ${session.id}. New status: ${subscriptionUpdated.status}`);
        break;

      case 'customer.subscription.deleted':
        // Subscription actually ended
        await supabaseAdmin
          .from('profiles')
          .update({
            plan_type: 'free',
            stripe_subscription_id: null,
          })
          .eq('stripe_subscription_id', session.id);
          
        console.log(`[Stripe Webhook] Downgraded user with subscription ${session.id} to FREE`);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Database Error when parsing Webhook:', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}
