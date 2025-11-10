import * as admin from 'firebase-admin';
import * as serviceAccount from '../serviceAccountKey.json';

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

async function createSuperAdmin() {
  const email = 'manishranjan2499@gmail.com';
  const password = 'Manish!!';
  
  console.log('🚀 Creating SuperAdmin account...');
  
  try {
    // Check if user already exists
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log('✓ User already exists, updating role...');
    } catch (error) {
      // User doesn't exist, create new
      console.log('✓ Creating new user...');
      userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: 'Manish Ranjan',
        emailVerified: true
      });
      console.log('✓ User created successfully!');
    }
    
    // Set custom claims
    console.log('✓ Setting custom claims...');
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true,
      superAdmin: true,
      role: 'superAdmin'
    });
    console.log('✓ Custom claims set!');
    
    // Create/update user document in Firestore
    console.log('✓ Creating Firestore user document...');
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      displayName: 'Manish Ranjan',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      disabled: false,
      metadata: {
        signupSource: 'initial_setup',
        isFounder: true
      }
    }, { merge: true });
    console.log('✓ User document created!');
    
    // Create role document
    console.log('✓ Creating user_roles document...');
    await admin.firestore().collection('user_roles').doc(userRecord.uid).set({
      userId: userRecord.uid,
      roles: ['admin', 'superAdmin'],
      assignedBy: 'system',
      assignedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastModified: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✓ Role document created!');
    
    console.log('\n✅ SuperAdmin created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 UID:', userRecord.uid);
    console.log('🛡️  Role: SuperAdmin');
    console.log('═══════════════════════════════════════\n');
    console.log('⚠️  IMPORTANT: Change the password after first login!\n');
    
  } catch (error) {
    console.error('❌ Error creating SuperAdmin:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

createSuperAdmin();
