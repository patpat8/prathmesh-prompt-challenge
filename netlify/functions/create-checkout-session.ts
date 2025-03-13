import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!event.body) {
      throw new Error('Missing request body');
    }

    const { tripId, departureDate } = JSON.parse(event.body);

    if (!tripId || !departureDate) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: tripId and departureDate' }),
      };
    }

    // Get trip details from Supabase
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (tripError) {
      console.error('Supabase error:', tripError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch trip details' }),
      };
    }

    if (!trip) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Trip not found' }),
      };
    }

    // Validate departure date
    if (!trip.departure_dates.includes(departureDate)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid departure date' }),
      };
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: trip.title,
              description: `${trip.description} - Departure: ${departureDate}`,
            },
            unit_amount: trip.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${event.headers.origin || ''}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${event.headers.origin || ''}/`,
      metadata: {
        tripId,
        departureDate,
      },
    });

    if (!session || !session.url) {
      throw new Error('Failed to create Stripe session');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
    };
  }
};