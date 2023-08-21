importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-messaging.js');

const firebaseConfig = {
    apiKey: 'AIzaSyDibFALHCXaw_WE0hOmLSZlr3DD1zMRXCo',
    authDomain: 'chatbox-a1493.firebaseapp.com',
    projectId: 'chatbox-a1493',
    storageBucket: 'chatbox-a1493.appspot.com',
    messagingSenderId: '569522095892',
    appId: '1:569522095892:web:020d59e438156a0f52a401',
    measurementId: 'G-1XZ5579XRJ',
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebaseApp.messaging();

messaging.onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
