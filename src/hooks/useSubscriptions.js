import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore';
import { app } from './useAuth';
import { APP_ID } from '../config/firebase';
import { calculateDaysLeft } from '../utils/dateHelpers';

const db = getFirestore(app);

/**
 * Custom hook for managing subscriptions with Firestore
 * @param {Object} user - Firebase user object
 * @returns {Object} Subscription state and methods
 */
export function useSubscriptions(user) {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get collection reference
    const getCollectionRef = useCallback(() => {
        if (!user) return null;
        return collection(db, 'artifacts', APP_ID, 'users', user.uid, 'subscriptions');
    }, [user]);

    // Subscribe to Firestore changes
    useEffect(() => {
        if (!user) {
            setSubscriptions([]);
            setLoading(false);
            return;
        }

        const collectionRef = getCollectionRef();
        if (!collectionRef) return;

        const q = query(collectionRef, orderBy('cost', 'desc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const subs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSubscriptions(subs);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Firestore error:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user, getCollectionRef]);

    // Add subscription
    const addSubscription = useCallback(async (data) => {
        if (!user) throw new Error('User not authenticated');

        const collectionRef = getCollectionRef();
        if (!collectionRef) throw new Error('Collection not available');

        try {
            const payload = {
                name: data.name,
                cost: Number(data.cost),
                billingDay: Number(data.billingDay),
                billingCycle: data.billingCycle || 'monthly',
                category: data.category,
                url: data.url || '',
                customColor: data.customColor || '',
                isPaused: false,
                notes: data.notes || '',
                trialEndDate: data.trialEndDate || null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const docRef = await addDoc(collectionRef, payload);
            return docRef.id;
        } catch (err) {
            console.error('Error adding subscription:', err);
            throw err;
        }
    }, [user, getCollectionRef]);

    // Update subscription
    const updateSubscription = useCallback(async (id, data) => {
        if (!user) throw new Error('User not authenticated');

        const docRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'subscriptions', id);

        try {
            const payload = {
                ...data,
                cost: data.cost !== undefined ? Number(data.cost) : undefined,
                billingDay: data.billingDay !== undefined ? Number(data.billingDay) : undefined,
                updatedAt: serverTimestamp()
            };

            // Remove undefined values
            Object.keys(payload).forEach(key => {
                if (payload[key] === undefined) delete payload[key];
            });

            await updateDoc(docRef, payload);
        } catch (err) {
            console.error('Error updating subscription:', err);
            throw err;
        }
    }, [user]);

    // Delete subscription
    const deleteSubscription = useCallback(async (id) => {
        if (!user) throw new Error('User not authenticated');

        const docRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'subscriptions', id);

        try {
            await deleteDoc(docRef);
        } catch (err) {
            console.error('Error deleting subscription:', err);
            throw err;
        }
    }, [user]);

    // Toggle pause status
    const togglePause = useCallback(async (id) => {
        const sub = subscriptions.find(s => s.id === id);
        if (!sub) return;

        await updateSubscription(id, {
            isPaused: !sub.isPaused,
            pausedAt: sub.isPaused ? null : serverTimestamp()
        });
    }, [subscriptions, updateSubscription]);

    // Batch import subscriptions
    const importSubscriptions = useCallback(async (subsToImport) => {
        if (!user) throw new Error('User not authenticated');

        const collectionRef = getCollectionRef();
        if (!collectionRef) throw new Error('Collection not available');

        const batch = writeBatch(db);

        for (const sub of subsToImport) {
            const docRef = doc(collectionRef);
            batch.set(docRef, {
                ...sub,
                cost: Number(sub.cost),
                billingDay: Number(sub.billingDay),
                isPaused: sub.isPaused || false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }

        await batch.commit();
        return subsToImport.length;
    }, [user, getCollectionRef]);

    // Clear all subscriptions
    const clearAllSubscriptions = useCallback(async () => {
        if (!user) throw new Error('User not authenticated');

        const batch = writeBatch(db);

        for (const sub of subscriptions) {
            const docRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'subscriptions', sub.id);
            batch.delete(docRef);
        }

        await batch.commit();
    }, [user, subscriptions]);

    // Computed values
    const totalMonthlyCost = useMemo(() => {
        return subscriptions
            .filter(s => !s.isPaused)
            .reduce((acc, curr) => {
                let monthlyCost = curr.cost;
                if (curr.billingCycle === 'yearly') {
                    monthlyCost = curr.cost / 12;
                } else if (curr.billingCycle === 'weekly') {
                    monthlyCost = curr.cost * 4;
                }
                return acc + monthlyCost;
            }, 0);
    }, [subscriptions]);

    const totalYearlyCost = useMemo(() => {
        return subscriptions
            .filter(s => !s.isPaused)
            .reduce((acc, curr) => {
                let yearlyCost = curr.cost * 12;
                if (curr.billingCycle === 'yearly') {
                    yearlyCost = curr.cost;
                } else if (curr.billingCycle === 'weekly') {
                    yearlyCost = curr.cost * 52;
                }
                return acc + yearlyCost;
            }, 0);
    }, [subscriptions]);

    const sortedByDate = useMemo(() => {
        return [...subscriptions]
            .map(sub => ({
                ...sub,
                daysLeft: calculateDaysLeft(sub.billingDay)
            }))
            .sort((a, b) => a.daysLeft - b.daysLeft);
    }, [subscriptions]);

    const upcomingPayments = useMemo(() => {
        return sortedByDate.filter(s => !s.isPaused && s.daysLeft <= 7);
    }, [sortedByDate]);

    const categoryBreakdown = useMemo(() => {
        const breakdown = {};
        subscriptions
            .filter(s => !s.isPaused)
            .forEach(sub => {
                if (!breakdown[sub.category]) {
                    breakdown[sub.category] = { count: 0, total: 0 };
                }
                breakdown[sub.category].count += 1;
                breakdown[sub.category].total += sub.cost;
            });
        return breakdown;
    }, [subscriptions]);

    return {
        subscriptions,
        loading,
        error,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        togglePause,
        importSubscriptions,
        clearAllSubscriptions,
        // Computed values
        totalMonthlyCost,
        totalYearlyCost,
        sortedByDate,
        upcomingPayments,
        categoryBreakdown,
        activeCount: subscriptions.filter(s => !s.isPaused).length,
        pausedCount: subscriptions.filter(s => s.isPaused).length,
    };
}
