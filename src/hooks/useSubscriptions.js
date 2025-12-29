import { useState, useEffect, useCallback } from 'react';
import { localStorageManager } from '../utils/localStorageManager';

export function useSubscriptions(user) {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initial load
    useEffect(() => {
        if (!user) {
            setSubscriptions([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = localStorageManager.getSubscriptions(user.id);
            setSubscriptions(data);
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Sync to storage whenever subscriptions change
    // Note: This optimization might be tricky with multiple updates, 
    // so we'll save explicitly in actions instead.

    const addSubscription = useCallback(async (data) => {
        if (!user) return;
        try {
            const newSub = {
                ...data,
                id: `sub_${Date.now()}`,
                userId: user.id,
                createdAt: new Date().toISOString()
            };

            const currentSubs = localStorageManager.getSubscriptions(user.id);
            const updatedSubs = [...currentSubs, newSub];
            localStorageManager.saveSubscriptions(user.id, updatedSubs);

            setSubscriptions(updatedSubs);
            return newSub.id;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [user]);

    const updateSubscription = useCallback(async (id, data) => {
        if (!user) return;
        try {
            const currentSubs = localStorageManager.getSubscriptions(user.id);
            const updatedSubs = currentSubs.map(sub =>
                sub.id === id ? { ...sub, ...data } : sub
            );

            localStorageManager.saveSubscriptions(user.id, updatedSubs);
            setSubscriptions(updatedSubs);
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [user]);

    const deleteSubscription = useCallback(async (id) => {
        if (!user) return;
        try {
            const currentSubs = localStorageManager.getSubscriptions(user.id);
            const updatedSubs = currentSubs.filter(sub => sub.id !== id);

            localStorageManager.saveSubscriptions(user.id, updatedSubs);
            setSubscriptions(updatedSubs);
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [user]);

    const togglePause = useCallback(async (id) => {
        if (!user) return;
        try {
            const currentSubs = localStorageManager.getSubscriptions(user.id);
            const sub = currentSubs.find(s => s.id === id);
            if (sub) {
                await updateSubscription(id, { isPaused: !sub.isPaused });
            }
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [user, updateSubscription]);

    const clearAllSubscriptions = useCallback(async () => {
        if (!user) return;
        try {
            localStorageManager.saveSubscriptions(user.id, []);
            setSubscriptions([]);
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [user]);

    const importSubscriptions = useCallback(async (newSubscriptions) => {
        if (!user) return;
        try {
            // Add IDs to imported data if missing
            const formattedSubs = newSubscriptions.map(sub => ({
                ...sub,
                id: sub.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId: user.id,
                createdAt: new Date().toISOString()
            }));

            const currentSubs = localStorageManager.getSubscriptions(user.id);
            const updatedSubs = [...currentSubs, ...formattedSubs];

            localStorageManager.saveSubscriptions(user.id, updatedSubs);
            setSubscriptions(updatedSubs);
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [user]);

    return {
        subscriptions,
        loading,
        error,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        togglePause,
        clearAllSubscriptions,
        importSubscriptions
    };
}
