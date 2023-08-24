import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { getMessaging } from 'firebase/messaging';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyBgNapY6sa09zMHS_AQy5HNbT2v1r4xQbE',
    authDomain: 'chatbox-dev-f610d.firebaseapp.com',
    projectId: 'chatbox-dev-f610d',
    storageBucket: 'chatbox-dev-f610d.appspot.com',
    messagingSenderId: '296798768254',
    appId: '1:296798768254:web:3ddbc581ff11f06a9e1c2f',
};

export const app = initializeApp(firebaseConfig);
export const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
export const functions = getFunctions(app);

if (import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true') {
    console.log('Using Firebase Emulator');
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectStorageEmulator(storage, 'localhost', 9199);
    connectFunctionsEmulator(functions, 'localhost', 5001);
}
