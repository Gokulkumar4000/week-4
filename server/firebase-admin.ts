import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
const apps = getApps();
let app;

if (apps.length === 0) {
  // For development, we'll use the Firebase emulator or configure with service account
  if (process.env.NODE_ENV === 'development') {
    app = initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'week-4-6c326',
    });
  } else {
    // For production, you would need a service account key
    app = initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'week-4-6c326',
    });
  }
} else {
  app = apps[0];
}

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
export { app as adminApp };