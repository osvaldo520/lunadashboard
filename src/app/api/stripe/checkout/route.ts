import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // Check if the user is authenticated via Supabase session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { user } = session;

    // Optional: Get or create customer ID
    // If the user already has a stripe_customer_id in our DB, we can use it to avoid duplicates
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
        // Create a new Customer in Stripe
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
                supabase_user_id: user.id
            }
        });
        customerId = customer.id;

        // Optionally update the Supabase profile with the new customer ID
        // Note: Doing it here is an optimization, the webhook will also do it.
        await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id);
    }

    // Get origin purely for redirecting back
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const stripeSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: 'price_1TC250RXif6FX1Bx8Vd5PWc4', // The exact string ID of the price provided
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${siteUrl}/dashboard?payment=success`,
      cancel_url: `${siteUrl}/?payment=cancelled`, // redirect to home if cancelled
      client_reference_id: user.id, // VERY IMPORTANT for webhook safety
      allow_promotion_codes: true, // Enables the promo code input field
      metadata: {
        userId: user.id
      }
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: any) {
    console.error('STRIPE CHECKOUT ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
