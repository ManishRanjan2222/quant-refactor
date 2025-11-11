# AMMLogic Admin Panel - Setup Guide

## Overview
This guide will help you set up the admin panel for your AMMLogic Trading Calculator. The setup is simple and takes about 5-10 minutes.

## Prerequisites
- Firebase project already set up
- Access to Firebase Console

---

## Step 1: Mark Your Account as Admin

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**: `manishtradingapp`
3. **Navigate to Firestore Database** (in the left sidebar)
4. **Click "Start collection"** button
5. **Collection ID**: Enter `user_roles`
6. **Click Next**

7. **Add your admin document**:
   - **Document ID**: Your user ID (find this in Authentication > Users)
     - Alternative: You can find your user ID by logging in and checking the browser console
   - **Field 1**: 
     - Field name: `isAdmin`
     - Type: `boolean`
     - Value: `true`
   - **Field 2**:
     - Field name: `role`
     - Type: `string`
     - Value: `admin`

8. **Click Save**

---

## Step 2: Create App Settings

### 2.1 Calculator Settings

1. In Firestore, **click "Start collection"**
2. **Collection ID**: `appSettings`
3. **Document ID**: `calculator`
4. **Add fields**:

```
nTrades (number): 8
l (number): 1
m (number): 2
t (number): 10
f (number): 0.1
initialAmount (number): 10000
```

5. **Click Save**

### 2.2 Site Settings

1. In the same `appSettings` collection, **click "Add document"**
2. **Document ID**: `site`
3. **Add fields**:

```
maintenanceMode (boolean): false
supportEmail (string): support@ammlogic.trade
socialLinks (map):
  twitter (string): ""
  linkedin (string): ""
  facebook (string): ""
  instagram (string): ""
  youtube (string): ""
```

4. **Click Save**

---

## Step 3: Create Pricing Plans

1. **Click "Start collection"**
2. **Collection ID**: `pricingPlans`

### Plan 1: Basic
- **Document ID**: `basic`
- **Fields**:
```
name (string): Basic
price (string): ₹999
period (string): /month
features (array):
  - Advanced Risk Calculator
  - Position Sizing Tools
  - Basic Trade History
  - Email Support
razorpayAmount (number): 99900
popular (boolean): false
order (number): 1
```

### Plan 2: Professional
- **Document ID**: `professional`
- **Fields**:
```
name (string): Professional
price (string): ₹2,499
period (string): /month
features (array):
  - Everything in Basic
  - Advanced Analytics
  - Portfolio Management
  - Priority Support
  - Custom Reports
razorpayAmount (number): 249900
popular (boolean): true
order (number): 2
```

### Plan 3: Enterprise
- **Document ID**: `enterprise`
- **Fields**:
```
name (string): Enterprise
price (string): ₹4,999
period (string): /month
features (array):
  - Everything in Professional
  - API Access
  - Dedicated Support
  - Custom Integrations
  - Team Features
razorpayAmount (number): 499900
popular (boolean): false
order (number): 3
```

---

## Step 4: Deploy Firestore Security Rules

1. **Install Firebase CLI** (if not already installed):
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**:
```bash
firebase login
```

3. **Initialize Firebase** (if not done already):
```bash
firebase init firestore
```
- Select your project: `manishtradingapp`
- Keep default files: `firestore.rules` and `firestore.indexes.json`

4. **Deploy security rules**:
```bash
firebase deploy --only firestore:rules
```

---

## Step 5: Test Admin Access

1. **Go to your app**: https://your-app-url.com/login
2. **Login** with your admin email: `manishranjan2499@gmail.com`
3. **You should be automatically redirected to**: `/admin`
4. **Verify you see**:
   - Admin sidebar with navigation
   - "ADMIN" badge in the sidebar
   - Dashboard with stats
   - All admin menu items

---

## Step 6: Verification Checklist

Before using the admin panel, verify:

- [ ] You can access `/admin` after login
- [ ] You see the admin badge in the sidebar
- [ ] Dashboard shows user and subscription stats
- [ ] Calculator Settings page loads and shows default values
- [ ] Pricing Plans page shows all 3 plans
- [ ] Users page shows list of registered users
- [ ] Subscriptions page shows active subscriptions
- [ ] Site Settings page loads maintenance mode toggle
- [ ] Regular users (non-admin) cannot access `/admin` routes

---

## Troubleshooting

### Issue: "Permission Denied" when accessing admin pages

**Solution**: 
1. Check Firestore rules are deployed: `firebase deploy --only firestore:rules`
2. Verify your `user_roles` document exists with `isAdmin: true`
3. Try logging out and logging back in
4. Clear browser cache and cookies

### Issue: Can't find your User ID

**Solution**:
1. Login to your app
2. Open browser console (F12)
3. Type: `firebase.auth().currentUser.uid`
4. Copy the ID shown

### Issue: Admin panel not loading

**Solution**:
1. Check browser console for errors
2. Verify all Firestore collections are created
3. Make sure you're using the correct user ID in `user_roles`

### Issue: Stats showing 0 in dashboard

**Solution**:
- This is normal if you don't have users or subscriptions yet
- The dashboard will update automatically as users sign up

---

## Next Steps

Now that your admin panel is set up, you can:

1. **Update Calculator Settings**: Change default values for all users
2. **Manage Pricing**: Add, edit, or remove subscription plans
3. **View Users**: Monitor user signups and activity
4. **Track Subscriptions**: See active and expired subscriptions
5. **Configure Site**: Enable maintenance mode, update social links

---

## Important Notes

### Security Best Practices

1. **Never share your admin credentials**
2. **Use strong passwords**
3. **Regularly check audit logs** (when implemented)
4. **Monitor user activity** for suspicious behavior
5. **Keep Firebase rules updated**

### Admin Role Management

To add more admins:
1. Get their User ID from Firebase Authentication
2. Add a new document in `user_roles` collection with their ID
3. Set `isAdmin: true` and `role: admin`
4. They'll have admin access on next login

To remove admin access:
1. Delete their document from `user_roles` collection
2. Or set `isAdmin: false`

---

## Support

If you encounter any issues:

1. **Check Firebase Console logs**: Firestore > Usage tab
2. **Check browser console**: F12 > Console tab
3. **Verify all steps** in this guide were completed

---

## Summary

✅ Your admin panel is now ready!

**Admin URL**: `/admin`
**Admin Email**: `manishranjan2499@gmail.com`

You can now control all aspects of your AMMLogic Trading Calculator from one central admin panel.
