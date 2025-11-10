# AMMLogic Admin Panel - Setup Guide

## 🚀 Phase 1: Security Foundation Setup

This guide will help you set up the secure backend infrastructure for the AMMLogic admin panel.

---

## Prerequisites

- Firebase CLI installed: `npm install -g firebase-tools`
- Node.js 18+ installed
- Firebase project already configured (check `src/config/firebase.ts`)

---

## Step 1: Download Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **manishtradingapp**
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `functions/serviceAccountKey.json`
6. **IMPORTANT**: Add this file to `.gitignore` - NEVER commit it!

```bash
echo "functions/serviceAccountKey.json" >> .gitignore
```

---

## Step 2: Install Cloud Functions Dependencies

```bash
cd functions
npm install
```

---

## Step 3: Create SuperAdmin Account

Run the setup script to create your SuperAdmin account:

```bash
cd functions
npx ts-node src/setupSuperAdmin.ts
```

This will create:
- **Email**: manishranjan2499@gmail.com
- **Password**: Manish!!
- **Role**: SuperAdmin with full admin privileges

⚠️ **CRITICAL**: Change this password immediately after first login!

---

## Step 4: Deploy Cloud Functions

Deploy all Cloud Functions to Firebase:

```bash
firebase deploy --only functions
```

Functions that will be deployed:
- `checkAdminRole` - Verify admin access
- `setUserRole` - Assign admin roles (SuperAdmin only)
- `disableUser` - Enable/disable user accounts
- `updateAppSettings` - Update global app settings
- `exportUserData` - Export data for compliance
- `createUserDocument` - Auto-create user docs on signup
- `updateLastLogin` - Track user activity

---

## Step 5: Deploy Firestore Security Rules

Deploy the security rules to protect your data:

```bash
firebase deploy --only firestore:rules
```

These rules ensure:
- ✅ Only admins can read user_roles collection
- ✅ Only SuperAdmins can assign admin roles
- ✅ Users can only access their own data
- ✅ Audit logs are immutable (write via Cloud Functions only)
- ✅ Custom claims are verified server-side

---

## Step 6: Initialize Required Collections

The following collections will be auto-created:
- `users` - User metadata (created on signup)
- `user_roles` - Role assignments (via Cloud Functions)
- `auditLogs` - Immutable audit trail
- `admin/appSettings` - Global settings

Create the initial app settings document:

```bash
# Run this in Firebase Console → Firestore → Add Document
Collection: admin
Document ID: appSettings
```

```json
{
  "riskPresets": [
    {
      "name": "Conservative",
      "l": 1,
      "m": 2,
      "t": 3,
      "f": 4
    },
    {
      "name": "Moderate",
      "l": 2,
      "m": 3,
      "t": 4,
      "f": 5
    },
    {
      "name": "Aggressive",
      "l": 3,
      "m": 4,
      "t": 5,
      "f": 6
    }
  ],
  "calcMultipliers": {
    "divisorMultiplier": 1
  },
  "maintenanceMode": {
    "enabled": false,
    "message": "We're performing scheduled maintenance. Please check back soon.",
    "allowedUsers": []
  },
  "brandColors": {
    "primary": "#9333EA",
    "accent": "#FF2D95",
    "background": "#0A0A0B"
  },
  "features": {
    "simulationEnabled": true,
    "maxTradesPerSession": 100
  }
}
```

---

## Step 7: Test SuperAdmin Login

1. Go to your app at `/auth`
2. Sign in with:
   - Email: manishranjan2499@gmail.com
   - Password: Manish!!
3. You should be automatically redirected to `/admin`

If you see a "Permission Denied" error:
- Log out and log back in (token needs refresh)
- Check Firebase Console → Authentication → Users → click your user → Custom Claims
- Should show: `{"admin": true, "superAdmin": true, "role": "superAdmin"}`

---

## Step 8: Verify Installation

Run these checks:

1. **Custom Claims Check**:
   - Firebase Console → Authentication → your user
   - Custom Claims should show admin and superAdmin

2. **Firestore Collections**:
   - Check that `users`, `user_roles` collections exist
   - Verify your SuperAdmin document is in `user_roles`

3. **Cloud Functions**:
   - Firebase Console → Functions
   - All functions should show "Healthy" status

4. **Security Rules**:
   - Firebase Console → Firestore → Rules
   - Should match the content from `firestore.rules`

---

## Adding More Admins

Once logged in as SuperAdmin:

1. Go to `/admin/users`
2. Find the user you want to promote
3. Click **"Make Admin"** button
4. User must log out and log back in to get new permissions

---

## Security Best Practices

### 🔒 Critical Security Rules

1. **NEVER store admin status in client-side code**
   - Always use Firebase Custom Claims
   - Verify server-side via Cloud Functions

2. **NEVER check admin with localStorage/cookies**
   - Custom Claims are in the JWT token
   - Verified automatically by Firebase

3. **Keep service account key secure**
   - Never commit `serviceAccountKey.json`
   - Rotate keys regularly
   - Use environment-specific keys

4. **Monitor audit logs regularly**
   - Check `/admin/audit-logs` weekly
   - Look for suspicious role changes
   - Verify data export activities

5. **Enable 2FA for admin accounts** (coming soon)

---

## Troubleshooting

### Issue: "Permission Denied" accessing /admin

**Solution**:
- User needs to log out and log back in
- Custom claims are cached in the token
- Force refresh: Call `refreshAdminStatus()` in useAuth hook

### Issue: Cloud Functions not deploying

**Solution**:
```bash
# Check Firebase CLI is logged in
firebase login

# Check you're in the right project
firebase use

# Try deploying with verbose logging
firebase deploy --only functions --debug
```

### Issue: "Service account key not found"

**Solution**:
- Download the key from Firebase Console → Project Settings → Service Accounts
- Save as `functions/serviceAccountKey.json`
- Make sure the file is in the correct location

### Issue: User created but no custom claims

**Solution**:
- Run the SuperAdmin setup script again
- It will update existing users with claims
- Check Firebase Console → Authentication → Users → Custom Claims

---

## Next Steps

✅ **Phase 1 Complete!** You now have:
- Secure role-based authentication
- Cloud Functions for admin operations
- Firestore security rules
- SuperAdmin account

**Coming Next**:
- Phase 2: Update authentication flow in the app
- Phase 3: Build admin UI components
- Phase 4: Implement admin pages (Dashboard, Users, Trades, etc.)

---

## Environment Variables

For local development, create `functions/.env`:

```env
FIREBASE_PROJECT_ID=manishtradingapp
```

For production, set Firebase Functions config:

```bash
firebase functions:config:set razorpay.key_id="your_key"
firebase functions:config:set razorpay.key_secret="your_secret"
```

---

## Support

If you encounter issues:
1. Check Firebase Console logs: Functions → Logs
2. Check browser console for client-side errors
3. Verify Firestore security rules are deployed
4. Ensure Cloud Functions are all "Healthy"

---

## Security Checklist

Before going to production:

- [ ] Changed SuperAdmin password from default
- [ ] Service account key is in `.gitignore`
- [ ] Firestore rules deployed and tested
- [ ] Cloud Functions deployed successfully
- [ ] Audit logs are being created
- [ ] Custom claims working correctly
- [ ] Regular users cannot access `/admin`
- [ ] Only SuperAdmins can assign admin roles
- [ ] All admin actions are logged in auditLogs

---

**Last Updated**: $(date)
**Firebase Project**: manishtradingapp
**Admin Panel Version**: 1.0.0
