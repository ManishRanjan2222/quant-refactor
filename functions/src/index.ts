import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

interface CashfreeOrderRequest {
  planId: string;
  planName: string;
  amount: number; // in cents
  userId: string;
  userEmail: string;
  userName?: string;
}

export const createCashfreeOrder = functions.https.onCall(async (data: CashfreeOrderRequest, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { planId, planName, amount, userId, userEmail, userName } = data;

  // Validate input
  if (!planId || !planName || !amount || !userId || !userEmail) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
  }

  // Get Cashfree credentials from config
  const cashfreeAppId = functions.config().cashfree.app_id;
  const cashfreeSecretKey = functions.config().cashfree.secret_key;

  if (!cashfreeAppId || !cashfreeSecretKey) {
    throw new functions.https.HttpsError('failed-precondition', 'Cashfree credentials not configured');
  }

  try {
    // Generate unique order ID
    const orderId = `order_${Date.now()}_${userId.substring(0, 8)}`;

    // Cashfree API endpoint for production
    const cashfreeApiUrl = 'https://api.cashfree.com/pg/orders';

    // Prepare order payload
    const orderPayload = {
      order_id: orderId,
      order_amount: (amount / 100).toFixed(2), // Convert cents to dollars
      order_currency: 'USD',
      customer_details: {
        customer_id: userId,
        customer_email: userEmail,
        customer_name: userName || userEmail.split('@')[0],
      },
      order_meta: {
        return_url: `${functions.config().app?.url || 'https://your-app-url.com'}/upgrade?status=success`,
        notify_url: `${functions.config().app?.url || 'https://your-app-url.com'}/api/cashfree-webhook`,
      },
      order_note: `${planName} Plan - AMMLogic.Trade`,
    };

    // Create order with Cashfree
    const response = await fetch(cashfreeApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': cashfreeAppId,
        'x-client-secret': cashfreeSecretKey,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cashfree API error:', errorData);
      throw new functions.https.HttpsError('internal', `Cashfree API error: ${errorData.message || 'Unknown error'}`);
    }

    const orderData = await response.json();

    // Return payment session ID and order ID to frontend
    return {
      paymentSessionId: orderData.payment_session_id,
      orderId: orderData.order_id,
      orderAmount: orderData.order_amount,
    };
  } catch (error: any) {
    console.error('Error creating Cashfree order:', error);
    throw new functions.https.HttpsError('internal', error.message || 'Failed to create payment order');
  }
});
