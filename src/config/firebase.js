import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyALgaoU5NHvEHvexRIgVAlCuauT9swaIEY",
    authDomain: "startups-7904a.firebaseapp.com",
    projectId: "startups-7904a",
    storageBucket: "startups-7904a.firebasestorage.app",
    messagingSenderId: "894321106938",
    appId: "1:894321106938:web:c7426dac0e4ad2c385ce43",
    measurementId: "G-MLF38YQFSR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with platform-appropriate persistence
let auth;
if (Platform.OS === 'web') {
    auth = getAuth(app);
} else {
    try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        auth = initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
    } catch (e) {
        auth = getAuth(app);
    }
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { app, auth, db, storage };

