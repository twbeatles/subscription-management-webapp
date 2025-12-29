// Utility for managing data in localStorage

const STORAGE_KEYS = {
    USERS: 'sub_manager_users',
    CURRENT_USER_ID: 'sub_manager_current_user_id',
    SUBSCRIPTIONS_PREFIX: 'sub_manager_data_'
};

export const localStorageManager = {
    // --- User Management ---

    getUsers: () => {
        try {
            const users = localStorage.getItem(STORAGE_KEYS.USERS);
            return users ? JSON.parse(users) : [];
        } catch (e) {
            console.error('Error reading users from local storage', e);
            return [];
        }
    },

    saveUsers: (users) => {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    },

    createUser: (name) => {
        const users = localStorageManager.getUsers();
        const newUser = {
            id: `user_${Date.now()}`,
            displayName: name,
            createdAt: new Date().toISOString(),
            isAdmin: false // Keeps compatibility with existing UI
        };
        users.push(newUser);
        localStorageManager.saveUsers(users);
        return newUser;
    },

    updateUser: (id, data) => {
        const users = localStorageManager.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...data };
            localStorageManager.saveUsers(users);
            return users[index];
        }
        return null;
    },

    deleteUser: (id) => {
        const users = localStorageManager.getUsers();
        const filteredUsers = users.filter(u => u.id !== id);
        localStorageManager.saveUsers(filteredUsers);

        // Also delete their data
        localStorage.removeItem(`${STORAGE_KEYS.SUBSCRIPTIONS_PREFIX}${id}`);
    },

    // --- Session Management ---

    getCurrentUserId: () => {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    },

    login: (userId) => {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    },

    logout: () => {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    },

    // --- Subscription Data Management ---

    getSubscriptions: (userId) => {
        if (!userId) return [];
        try {
            const data = localStorage.getItem(`${STORAGE_KEYS.SUBSCRIPTIONS_PREFIX}${userId}`);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading subscriptions', e);
            return [];
        }
    },

    saveSubscriptions: (userId, subscriptions) => {
        if (!userId) return;
        localStorage.setItem(`${STORAGE_KEYS.SUBSCRIPTIONS_PREFIX}${userId}`, JSON.stringify(subscriptions));
    }
};
