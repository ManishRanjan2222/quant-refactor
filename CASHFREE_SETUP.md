# Cashfree Payment Integration Setup Guide

This guide will help you set up Cashfree payments with Firebase Cloud Functions for AMMLogic.Trade.

## Prerequisites

- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project initialized
- Node.js 18+ installed

## Step 1: Initialize Firebase Functions

```bash
# Login to Firebase
firebase login

# Initialize functions if not already done
firebase init functions
# Select JavaScript or TypeScript
# Install dependencies: Yes
```

## Step 2: Install Dependencies

```bash
cd functions
npm install
```

## Step 3: Configure Cashfree Credentials

Store your Cashfree credentials securely using Firebase Functions config:

```bash
firebase functions:config:set cashfree.app_id="1137397ad9a4f401f0c47c8e92b7937311"
firebase functions:config:set cashfree.secret_key="cfsk_ma_prod_96469524aaed01c7c6945a7e3314cc70_7d552d85"
```

**Optional**: Set your app URL for redirects:
```bash
firebase functions:config:set app.url="https://your-domain.com"
```

## Step 4: Deploy the Function

```bash
# Deploy only the functions
firebase deploy --only functions
```

Wait for deployment to complete. You should see:
```
✔  functions[createCashfreeOrder]: Successful create operation.
```

## Step 5: Update Firebase Security Rules

Deploy the Firestore security rules:

```bash
firebase deploy --only firestore:rules
```

## Step 6: Test the Integration

1. Login to your application
2. Navigate to the Upgrade page (`/upgrade`)
3. Try purchasing the Trial plan ($1)
4. Complete the payment using Cashfree's test/production gateway
5. Verify subscription is created in Firestore `subscriptions` collection
6. Verify transaction is logged in `transactions` collection

## Firestore Collections Structure

### `subscriptions/{userId}`
```javascript
{
  planId: 'trial' | 'annual' | 'lifetime',
  planName: string,
  startDate: Timestamp,
  endDate: Timestamp,
  isLifetime: boolean,
  cashfreeOrderId: string,
  userId: string,
  userEmail: string
}
```

### `transactions/{transactionId}`
```javascript
{
  userId: string,
  userEmail: string,
  planId: string,
  planName: string,
  amount: number, // in cents
  currency: 'USD',
  cashfreeOrderId: string,
  status: 'success' | 'failed' | 'pending',
  createdAt: Timestamp
}
```

### `userProfiles/{userId}`
```javascript
{
  name: string,
  phone: string,
  language: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Troubleshooting

### Function not found error
- Ensure function is deployed: `firebase deploy --only functions`
- Check Firebase Console > Functions to verify deployment

### Config not set error
- Verify config: `firebase functions:config:get`
- Re-set credentials if needed

### Payment not completing
- Check browser console for errors
- Verify Cashfree App ID is correct
- Ensure Cashfree account is in production mode

### CORS errors
- Verify your domain is allowed in Firebase Console
- Check Firebase Hosting configuration

## Security Notes

🔒 **CRITICAL SECURITY**:
- Secret keys are stored in Firebase Functions config (server-side)
- Never expose secret keys in client-side code
- App ID can be in client code (it's meant to be public)
- All payment verification happens server-side

## Pricing Plans

| Plan | Price | Duration | Plan ID |
|------|-------|----------|---------|
| Trial | $1 | 1 month | `trial` |
| Annual | $50 | 12 months | `annual` |
| Lifetime | $100 | Forever | `lifetime` |

## Support

For issues with:
- **Firebase**: https://firebase.google.com/support
- **Cashfree**: https://docs.cashfree.com/
- **AMMLogic.Trade**: support@ammlogic.trade

## Next Steps

1. ✅ Test all payment flows
2. ✅ Verify subscription gating on calculator
3. ✅ Test profile and dashboard pages
4. ✅ Monitor transactions in Firebase Console
5. ✅ Set up Cashfree webhooks (optional, for advanced tracking)

---

**Deployment Date**: {Deployed when you ran `firebase deploy`}
**Last Updated**: November 27, 2025
