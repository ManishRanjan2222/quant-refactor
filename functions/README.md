# AMMLogic Cloud Functions

This directory contains Firebase Cloud Functions for the AMMLogic admin panel.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Download service account key from Firebase Console and save as `serviceAccountKey.json`

3. Create SuperAdmin:
```bash
npx ts-node src/setupSuperAdmin.ts
```

4. Deploy functions:
```bash
firebase deploy --only functions
```

## Available Functions

### Admin Role Management

- **checkAdminRole**: Verify if a user has admin access
- **setUserRole**: Assign admin/superAdmin role (SuperAdmin only)
- **disableUser**: Enable/disable user accounts (Admin only)

### Data Management

- **exportUserData**: Export data for compliance (Admin only)
- **updateAppSettings**: Update global app settings (SuperAdmin only)

### Automatic Triggers

- **createUserDocument**: Auto-create user document on signup
- **updateLastLogin**: Update last login timestamp

## Security

All admin functions verify custom claims server-side. Never rely on client-side admin checks.

## Testing Locally

```bash
npm run serve
```

This starts the Firebase emulator for local testing.
