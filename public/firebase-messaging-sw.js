importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-messaging.js');

const firebaseConfig = {
    apiKey: 'AIzaSyBgNapY6sa09zMHS_AQy5HNbT2v1r4xQbE',
    authDomain: 'chatbox-dev-f610d.firebaseapp.com',
    projectId: 'chatbox-dev-f610d',
    storageBucket: 'chatbox-dev-f610d.appspot.com',
    messagingSenderId: '296798768254',
    appId: '1:296798768254:web:3ddbc581ff11f06a9e1c2f',
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const messaging = firebaseApp.messaging();

messaging.onBackgroundMessage(messaging, (payload) => {
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
