import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Create a new user account with email and password.
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signUp(email, password, displayName) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // Set display name on the auth profile
    if (displayName) {
        await updateProfile(credential.user, { displayName });
    }
    return credential;
}

/**
 * Sign in an existing user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out the current user.
 * @returns {Promise<void>}
 */
export async function signOut() {
    return firebaseSignOut(auth);
}

/**
 * Get the currently signed-in user (or null).
 * @returns {import('firebase/auth').User | null}
 */
export function getCurrentUser() {
    return auth.currentUser;
}

/**
 * Listen for auth state changes.
 * @param {function} callback - receives (user) or (null)
 * @returns {function} unsubscribe function
 */
export function onAuthStateChanged(callback) {
    return firebaseOnAuthStateChanged(auth, callback);
}
