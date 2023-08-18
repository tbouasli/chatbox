import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getMessaging, onMessage } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyDibFALHCXaw_WE0hOmLSZlr3DD1zMRXCo',
    authDomain: 'chatbox-a1493.firebaseapp.com',
    projectId: 'chatbox-a1493',
    storageBucket: 'chatbox-a1493.appspot.com',
    messagingSenderId: '569522095892',
    appId: '1:569522095892:web:020d59e438156a0f52a401',
    measurementId: 'G-1XZ5579XRJ',
};

export const app = initializeApp(firebaseConfig);
export const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));
export const auth = getAuth(app);
export const firestore = initializeFirestore(app, {
    localCache: persistentLocalCache({
        cacheSizeBytes: 1_000_000_000, // 1GB
    }),
});
export const storage = getStorage(app);
export const messaging = getMessaging(app);

function requestPermission() {
    alert('requesting permission');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            alert('Notification permission granted.');
        } else {
            alert('Unable to get permission to notify.');
        }
    });
}

onMessage(messaging, (payload) => {
    alert('Message received. ', payload);
    // ...
});

requestPermission();
