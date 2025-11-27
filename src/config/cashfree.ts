// ⚠️ WARNING: These credentials are exposed in the frontend
// This is NOT recommended for production but done per user request
// Ideally, order creation should happen server-side to protect the secret key

export const CASHFREE_CONFIG = {
  appId: '1137397ad9a4f401f0c47c8e92b7937311',
  secretKey: 'cfsk_ma_prod_96469524aaed01c7c6945a7e3314cc70_7d552d85',
  environment: 'production' as const,
  apiUrl: 'https://api.cashfree.com/pg/orders',
  apiVersion: '2023-08-01',
};
