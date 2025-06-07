import 'dotenv/config';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { AppUser } from '../src/types'; // Adjust path if necessary

// Load Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase Admin App (or a regular app for client-side SDK)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables.');
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error("ERROR: Firebase project ID is not loaded. Ensure .env file is configured and dotenv/config is imported first.");
    process.exit(1);
  }

  console.log(`Attempting to create admin user for project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}...`);

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const adminUid = userCredential.user.uid;
    console.log(`Admin user created in Firebase Authentication with UID: ${adminUid}`);

    // Add user to 'users' collection in Firestore
    const usersCollection = collection(db, 'users');
    const adminUserDoc: AppUser = {
      uid: adminUid,
      email: adminEmail,
      role: 'admin',
      displayName: 'Administrator', // Default display name for admin
      createdAt: serverTimestamp(), // Use Firestore server timestamp
    };

    await setDoc(doc(usersCollection, adminUid), adminUserDoc);
    console.log(`Admin user document created in Firestore in 'users' collection with UID: ${adminUid}`);
    console.log('Admin user seeding successful!');

  } catch (error) {
    console.error('Error seeding admin user:');
    if (error instanceof Error) {
      console.error(`Message: ${error.message}`);
      // Firebase specific error codes can be helpful
      if ('code' in error) {
        console.error(`Firebase Error Code: ${error.code}`);
      }
      console.error(`Stack: ${error.stack}`);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
};

seedAdmin()
  .then(() => {
    console.log('Admin seeding process finished.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Unhandled error in admin seeding process:', err);
    process.exit(1);
  });
