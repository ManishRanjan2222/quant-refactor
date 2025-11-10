import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Check if user has admin role
export const checkAdminRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Not authenticated');
  }

  try {
    const user = await admin.auth().getUser(context.auth.uid);
    const customClaims = user.customClaims || {};
    
    return {
      isAdmin: customClaims.admin === true,
      isSuperAdmin: customClaims.superAdmin === true,
      role: customClaims.role || 'user'
    };
  } catch (error) {
    console.error('Error checking admin role:', error);
    throw new functions.https.HttpsError('internal', 'Failed to check admin role');
  }
});

// Set user role (SuperAdmin only)
export const setUserRole = functions.https.onCall(async (data, context) => {
  // Verify caller is authenticated and is superAdmin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Not authenticated');
  }

  const caller = await admin.auth().getUser(context.auth.uid);
  if (!caller.customClaims?.superAdmin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only SuperAdmins can assign roles'
    );
  }

  const { targetUserId, roles } = data;

  if (!targetUserId || !Array.isArray(roles)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid parameters');
  }

  try {
    // Set custom claims
    const isAdmin = roles.includes('admin') || roles.includes('superAdmin');
    const isSuperAdmin = roles.includes('superAdmin');

    await admin.auth().setCustomUserClaims(targetUserId, {
      admin: isAdmin,
      superAdmin: isSuperAdmin,
      role: isSuperAdmin ? 'superAdmin' : isAdmin ? 'admin' : 'user'
    });

    // Update user_roles collection
    await admin.firestore().collection('user_roles').doc(targetUserId).set({
      userId: targetUserId,
      roles,
      assignedBy: context.auth.uid,
      assignedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastModified: admin.firestore.FieldValue.serverTimestamp()
    });

    // Log the action
    await admin.firestore().collection('auditLogs').add({
      actorId: context.auth.uid,
      actorEmail: caller.email,
      actionType: 'role_assigned',
      targetCollection: 'user_roles',
      targetId: targetUserId,
      details: { roles },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, message: 'Role assigned successfully' };
  } catch (error) {
    console.error('Error setting user role:', error);
    throw new functions.https.HttpsError('internal', 'Failed to set user role');
  }
});

// Disable user account (Admin only)
export const disableUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Not authenticated');
  }

  const caller = await admin.auth().getUser(context.auth.uid);
  if (!caller.customClaims?.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  const { userId, disabled } = data;

  try {
    await admin.auth().updateUser(userId, { disabled });

    await admin.firestore().collection('users').doc(userId).update({
      disabled,
      lastModified: admin.firestore.FieldValue.serverTimestamp()
    });

    await admin.firestore().collection('auditLogs').add({
      actorId: context.auth.uid,
      actorEmail: caller.email,
      actionType: disabled ? 'user_disabled' : 'user_enabled',
      targetCollection: 'users',
      targetId: userId,
      details: { disabled },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error disabling user:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update user status');
  }
});

// Update app settings (SuperAdmin only)
export const updateAppSettings = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Not authenticated');
  }

  const caller = await admin.auth().getUser(context.auth.uid);
  if (!caller.customClaims?.superAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'SuperAdmin access required');
  }

  const { settings } = data;

  try {
    await admin.firestore().collection('admin').doc('appSettings').set(settings, { merge: true });

    await admin.firestore().collection('auditLogs').add({
      actorId: context.auth.uid,
      actorEmail: caller.email,
      actionType: 'settings_updated',
      targetCollection: 'admin',
      targetId: 'appSettings',
      details: { settings },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating settings:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update settings');
  }
});

// Export user data (Admin only)
export const exportUserData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Not authenticated');
  }

  const caller = await admin.auth().getUser(context.auth.uid);
  if (!caller.customClaims?.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  const { collection: collectionName, filters } = data;

  try {
    let query = admin.firestore().collection(collectionName);

    // Apply filters if provided
    if (filters?.startDate) {
      query = query.where('createdAt', '>=', new Date(filters.startDate));
    }
    if (filters?.endDate) {
      query = query.where('createdAt', '<=', new Date(filters.endDate));
    }

    const snapshot = await query.get();
    const exportData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    await admin.firestore().collection('auditLogs').add({
      actorId: context.auth.uid,
      actorEmail: caller.email,
      actionType: 'data_exported',
      targetCollection: collectionName,
      targetId: 'export',
      details: { recordCount: exportData.length, filters },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, data: exportData };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new functions.https.HttpsError('internal', 'Failed to export data');
  }
});

// Create user document on signup
export const createUserDocument = functions.auth.user().onCreate(async (user) => {
  try {
    await admin.firestore().collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      disabled: false,
      metadata: {
        signupSource: 'web',
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Error creating user document:', error);
  }
});

// Update last login timestamp
export const updateLastLogin = functions.auth.user().beforeSignIn(async (user) => {
  try {
    await admin.firestore().collection('users').doc(user.uid).update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
  return user;
});
