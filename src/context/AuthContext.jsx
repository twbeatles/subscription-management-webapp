import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signInAnonymously,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';
import firebaseConfig, { APP_ID } from '../config/firebase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDemo, setIsDemo] = useState(false);

    // Check for demo mode in localStorage
    useEffect(() => {
        const demoMode = localStorage.getItem('demoMode');
        if (demoMode) {
            const demoData = JSON.parse(demoMode);
            const expiresAt = new Date(demoData.expiresAt);
            if (expiresAt > new Date()) {
                setIsDemo(true);
                setLoading(false);
            } else {
                localStorage.removeItem('demoMode');
                localStorage.removeItem('demoSubscriptions');
            }
        }
    }, []);

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && !isDemo) {
                setUser(firebaseUser);
                // Fetch user profile from Firestore
                await fetchUserProfile(firebaseUser.uid);
            } else if (!isDemo) {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isDemo]);

    // Fetch user profile from Firestore
    const fetchUserProfile = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                setUserProfile(userDoc.data());
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
        }
    };

    // Create or update user profile in Firestore
    const createUserProfile = async (firebaseUser, additionalData = {}) => {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userRef);

        const profileData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || additionalData.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            isAdmin: false,
            isDisabled: false,
            lastLoginAt: serverTimestamp(),
            ...additionalData
        };

        if (!userDoc.exists()) {
            profileData.createdAt = serverTimestamp();
            profileData.subscriptionCount = 0;
            profileData.totalMonthlyCost = 0;
        }

        await setDoc(userRef, profileData, { merge: true });
        setUserProfile(profileData);
    };

    // Email/Password Sign Up
    const signUpWithEmail = useCallback(async (email, password, displayName) => {
        setError(null);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, { displayName });
            await createUserProfile(result.user, { displayName });

            // If coming from demo mode, migrate data
            if (isDemo) {
                await migrateDemoData(result.user.uid);
            }

            setIsDemo(false);
            return result.user;
        } catch (err) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    }, [isDemo]);

    // Email/Password Sign In
    const signInWithEmail = useCallback(async (email, password) => {
        setError(null);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await createUserProfile(result.user);
            setIsDemo(false);
            return result.user;
        } catch (err) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    }, []);

    // Google Sign In
    const signInWithGoogle = useCallback(async () => {
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await createUserProfile(result.user);

            // If coming from demo mode, migrate data
            if (isDemo) {
                await migrateDemoData(result.user.uid);
            }

            setIsDemo(false);
            return result.user;
        } catch (err) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    }, [isDemo]);

    // Anonymous Sign In (Guest)
    const signInAsGuest = useCallback(async () => {
        setError(null);
        try {
            const result = await signInAnonymously(auth);
            await createUserProfile(result.user, { displayName: '게스트' });
            setIsDemo(false);
            return result.user;
        } catch (err) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    }, []);

    // Start Demo Mode
    const startDemoMode = useCallback(() => {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);

        localStorage.setItem('demoMode', JSON.stringify({
            startedAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString()
        }));

        setIsDemo(true);
        setLoading(false);
    }, []);

    // Exit Demo Mode
    const exitDemoMode = useCallback(() => {
        localStorage.removeItem('demoMode');
        localStorage.removeItem('demoSubscriptions');
        setIsDemo(false);
    }, []);

    // Migrate demo data to Firestore
    const migrateDemoData = async (uid) => {
        const demoSubs = localStorage.getItem('demoSubscriptions');
        if (demoSubs) {
            const subs = JSON.parse(demoSubs);
            // Import subscriptions using useSubscriptions hook
            // This will be handled by the component that calls signUp
            localStorage.setItem('pendingMigration', JSON.stringify({ uid, subs }));
        }
        localStorage.removeItem('demoMode');
        localStorage.removeItem('demoSubscriptions');
    };

    // Password Reset
    const resetPassword = useCallback(async (email) => {
        setError(null);
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (err) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    }, []);

    // Update Profile
    const updateUserProfile = useCallback(async (data) => {
        setError(null);
        try {
            if (data.displayName || data.photoURL) {
                await updateProfile(auth.currentUser, {
                    displayName: data.displayName || auth.currentUser.displayName,
                    photoURL: data.photoURL || auth.currentUser.photoURL
                });
            }

            const userRef = doc(db, 'users', auth.currentUser.uid);
            await setDoc(userRef, data, { merge: true });

            setUserProfile(prev => ({ ...prev, ...data }));
            setUser(auth.currentUser);
        } catch (err) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    }, []);

    // Change Password
    const changePassword = useCallback(async (currentPassword, newPassword) => {
        setError(null);
        try {
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                currentPassword
            );
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, newPassword);
        } catch (err) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    }, []);

    // Sign Out
    const signOut = useCallback(async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            setUserProfile(null);
            setIsDemo(false);
        } catch (err) {
            console.error('Sign out error:', err);
        }
    }, []);

    // Check if user is admin
    const isAdmin = userProfile?.isAdmin === true;

    const value = {
        user,
        userProfile,
        loading,
        error,
        isDemo,
        isAdmin,
        isAuthenticated: !!user || isDemo,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signInAsGuest,
        startDemoMode,
        exitDemoMode,
        resetPassword,
        updateUserProfile,
        changePassword,
        signOut,
        clearError: () => setError(null)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Error message helper
function getErrorMessage(code) {
    const messages = {
        'auth/email-already-in-use': '이미 사용 중인 이메일입니다',
        'auth/invalid-email': '유효하지 않은 이메일 형식입니다',
        'auth/operation-not-allowed': '이 로그인 방식은 비활성화되어 있습니다',
        'auth/weak-password': '비밀번호가 너무 약합니다 (6자 이상)',
        'auth/user-disabled': '비활성화된 계정입니다',
        'auth/user-not-found': '존재하지 않는 계정입니다',
        'auth/wrong-password': '비밀번호가 올바르지 않습니다',
        'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다',
        'auth/too-many-requests': '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요',
        'auth/popup-closed-by-user': '로그인 팝업이 닫혔습니다',
        'auth/cancelled-popup-request': '로그인이 취소되었습니다',
        'auth/network-request-failed': '네트워크 오류가 발생했습니다',
    };
    return messages[code] || '오류가 발생했습니다. 다시 시도해주세요.';
}

export { auth, db, app };
