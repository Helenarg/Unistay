import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from '../services/authService';
import { getUserProfile } from '../services/firestoreService';

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the app and provides global auth + user profile state.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);          // Firebase Auth user
    const [userProfile, setUserProfile] = useState(null); // Firestore user doc
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                // Fetch the Firestore profile
                try {
                    const profile = await getUserProfile(firebaseUser.uid);
                    setUserProfile(profile);
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                    setUserProfile(null);
                }
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    /**
     * Refresh the user profile from Firestore (call after updates).
     */
    const refreshProfile = async () => {
        if (user) {
            const profile = await getUserProfile(user.uid);
            setUserProfile(profile);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, refreshProfile, setUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to access auth context.
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
