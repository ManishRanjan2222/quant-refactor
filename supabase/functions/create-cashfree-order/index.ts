import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Cashfree credentials from environment
    const CASHFREE_APP_ID = Deno.env.get('CASHFREE_APP_ID');
    const CASHFREE_SECRET_KEY = Deno.env.get('CASHFREE_SECRET_KEY');

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      throw new Error('Cashfree credentials not configured');
    }

    // Parse request body
    const { orderId, amount, currency, customerDetails, orderNote } = await req.json();

    console.log('Creating Cashfree order:', { orderId, amount, currency });

    // Prepare Cashfree order data
    const orderData = {
      order_id: orderId,
      order_amount: amount,
      order_currency: currency,
      customer_details: customerDetails,
      order_meta: {
        return_url: `${req.headers.get('origin') || 'https://ammlogic.trade'}/upgrade?status=success`,
        notify_url: `${req.headers.get('origin') || 'https://ammlogic.trade'}/api/cashfree-webhook`,
      },
      order_note: orderNote,
    };

    // Call Cashfree API
    const cashfreeResponse = await fetch('https://api.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify(orderData),
    });

    if (!cashfreeResponse.ok) {
      const errorData = await cashfreeResponse.json().catch(() => ({}));
      console.error('Cashfree API error:', errorData);
      throw new Error(errorData.message || `Cashfree API error: ${cashfreeResponse.status}`);
    }

    const cashfreeData = await cashfreeResponse.json();
    console.log('Cashfree order created successfully:', cashfreeData.order_id);

    return new Response(
      JSON.stringify(cashfreeData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in create-cashfree-order:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
