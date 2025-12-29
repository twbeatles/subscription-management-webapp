import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithCustomToken,
    signInAnonymously,
    onAuthStateChanged
} from 'firebase/auth';
import firebaseConfig from '../config/firebase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Custom hook for Firebase authentication
 * @returns {Object} { user, loading, error, signIn, signOut }
 */
export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Check for custom token (for embedded environments)
                if (typeof window !== 'undefined' && window.__initial_auth_token) {
                    await signInWithCustomToken(auth, window.__initial_auth_token);
                } else {
                    // Fallback to anonymous auth
                    await signInAnonymously(auth);
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                setError(err.message);
                // Try anonymous auth as fallback
                try {
                    await signInAnonymously(auth);
                } catch (anonErr) {
                    setError(anonErr.message);
                }
            }
        };

        initAuth();

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async () => {
        setLoading(true);
        try {
            await signInAnonymously(auth);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            await auth.signOut();
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    return {
        user,
        loading,
        error,
        signIn,
        signOut,
        auth
    };
}

export { app, auth };
