import { createContext, useContext, useState, useEffect } from 'react';
import { localStorageManager } from '../utils/localStorageManager';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // Current user object
    const [loading, setLoading] = useState(true);

    // Initialize auth state
    useEffect(() => {
        const initAuth = () => {
            const currentUserId = localStorageManager.getCurrentUserId();
            if (currentUserId) {
                const users = localStorageManager.getUsers();
                const foundUser = users.find(u => u.id === currentUserId);
                if (foundUser) {
                    setUser(foundUser);
                } else {
                    // User id exists in session but user not found (deleted?)
                    localStorageManager.logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    // Login (Select Profile)
    const login = async (userId) => {
        const users = localStorageManager.getUsers();
        const foundUser = users.find(u => u.id === userId);
        if (!foundUser) throw new Error('User not found');

        localStorageManager.login(userId);
        setUser(foundUser);
        return foundUser;
    };

    // Register (Create Profile)
    const register = async (name) => {
        const newUser = localStorageManager.createUser(name);
        await login(newUser.id);
        return newUser;
    };

    // Update Profile
    const updateProfile = async (data) => {
        if (!user) return;
        const updatedUser = localStorageManager.updateUser(user.id, data);
        setUser(updatedUser);
    };

    // Logout
    const logout = async () => {
        localStorageManager.logout();
        setUser(null);
    };

    // Delete Account
    const deleteAccount = async () => {
        if (!user) return;
        localStorageManager.deleteUser(user.id);
        await logout();
    };

    const value = {
        user,
        userProfile: user, // For compatibility with existing code
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        login,
        register,
        updateProfile,
        logout,
        deleteAccount,
        // Compatibility stubs for existing code calling firebase methods
        signInWithEmail: () => Promise.reject(new Error("Local mode only")),
        signInWithGoogle: () => Promise.reject(new Error("Local mode only")),
        resetPassword: () => Promise.reject(new Error("Local mode only")),
        changePassword: () => Promise.reject(new Error("Local mode only"))
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
