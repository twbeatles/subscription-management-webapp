import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { Plus } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useSubscriptions } from './hooks/useSubscriptions';
import { calculateDaysLeft } from './utils/dateHelpers';
import { getDemoSubscriptions, saveDemoSubscription, deleteDemoSubscription } from './utils/demoData';

// Components (Keep MainApp critical components eager loaded for now if small, 
// but Pages should definitely be lazy)
import Header from './components/Header';
import TotalCostCard from './components/TotalCostCard';
import AlertCard from './components/AlertCard';
import Dashboard from './components/Dashboard';
import FilterBar from './components/FilterBar';
import SubscriptionList from './components/SubscriptionList';
import SubscriptionModal from './components/SubscriptionModal';
import SettingsPanel from './components/SettingsPanel';
import DemoBanner from './components/DemoBanner';

// Lazy Loaded Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));


// Loading Screen
function PageLoader() {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-dark-900">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 spinner" />
            </div>
        </div>
    );
}

// Main App Content (authenticated)
function MainApp() {
    const { user, isDemo, isAuthenticated } = useAuth();

    // Use Firestore for real users, localStorage for demo
    const firebaseHook = useSubscriptions(isDemo ? null : user);

    // Demo mode state
    const [demoSubscriptions, setDemoSubscriptions] = useState([]);

    useEffect(() => {
        if (isDemo) {
            setDemoSubscriptions(getDemoSubscriptions());
        }
    }, [isDemo]);

    // Combined subscriptions (demo or firebase)
    const subscriptions = isDemo ? demoSubscriptions : firebaseHook.subscriptions;
    const loading = isDemo ? false : firebaseHook.loading;

    // Demo mode handlers
    const handleAddSubscription = useCallback(async (data) => {
        if (isDemo) {
            const newSub = saveDemoSubscription({ ...data, id: `demo-${Date.now()}` });
            setDemoSubscriptions(getDemoSubscriptions());
            return newSub.id;
        }
        return firebaseHook.addSubscription(data);
    }, [isDemo, firebaseHook]);

    const handleUpdateSubscription = useCallback(async (id, data) => {
        if (isDemo) {
            const subs = getDemoSubscriptions();
            const sub = subs.find(s => s.id === id);
            if (sub) {
                saveDemoSubscription({ ...sub, ...data });
                setDemoSubscriptions(getDemoSubscriptions());
            }
            return;
        }
        return firebaseHook.updateSubscription(id, data);
    }, [isDemo, firebaseHook]);

    const handleDeleteSubscription = useCallback(async (id) => {
        if (isDemo) {
            deleteDemoSubscription(id);
            setDemoSubscriptions(getDemoSubscriptions());
            return;
        }
        return firebaseHook.deleteSubscription(id);
    }, [isDemo, firebaseHook]);

    const handleTogglePause = useCallback(async (id) => {
        if (isDemo) {
            const subs = getDemoSubscriptions();
            const sub = subs.find(s => s.id === id);
            if (sub) {
                saveDemoSubscription({ ...sub, isPaused: !sub.isPaused });
                setDemoSubscriptions(getDemoSubscriptions());
            }
            return;
        }
        return firebaseHook.togglePause(id);
    }, [isDemo, firebaseHook]);

    // UI state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [toast, setToast] = useState(null);

    // Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortBy, setSortBy] = useState('daysLeft');
    const [showPaused, setShowPaused] = useState(true);

    // Add daysLeft to all subscriptions
    const subscriptionsWithDaysLeft = useMemo(() => {
        return subscriptions.map(sub => ({
            ...sub,
            daysLeft: calculateDaysLeft(sub.billingDay)
        }));
    }, [subscriptions]);

    // Computed values
    const totalMonthlyCost = useMemo(() => {
        return subscriptions
            .filter(s => !s.isPaused)
            .reduce((acc, curr) => acc + (curr.cost || 0), 0);
    }, [subscriptions]);

    const totalYearlyCost = totalMonthlyCost * 12;

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

    // Alert items (within 3 days)
    const alertItems = useMemo(() => {
        return subscriptionsWithDaysLeft
            .filter(s => !s.isPaused && s.daysLeft <= 3)
            .sort((a, b) => a.daysLeft - b.daysLeft);
    }, [subscriptionsWithDaysLeft]);

    // Show toast notification
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // Modal handlers
    const handleOpenModal = useCallback((item = null) => {
        setEditData(item);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditData(null);
    }, []);

    const handleSave = useCallback(async (data, id) => {
        try {
            if (id) {
                await handleUpdateSubscription(id, data);
                showToast('구독이 수정되었습니다');
            } else {
                await handleAddSubscription(data);
                showToast('새 구독이 추가되었습니다');
            }
        } catch (error) {
            showToast('저장 중 오류가 발생했습니다', 'error');
            console.error(error);
        }
    }, [handleAddSubscription, handleUpdateSubscription, showToast]);

    const handleDelete = useCallback(async (id) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            await handleDeleteSubscription(id);
            showToast('구독이 삭제되었습니다');
        } catch (error) {
            showToast('삭제 중 오류가 발생했습니다', 'error');
            console.error(error);
        }
    }, [handleDeleteSubscription, showToast]);

    const handleCategoryClick = useCallback((category) => {
        setSelectedCategory(prev => prev === category ? null : category);
    }, []);

    const activeCount = subscriptions.filter(s => !s.isPaused).length;

    // Loading state
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-dark-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 spinner" />
                    <p className="text-gray-500 dark:text-dark-400 text-sm">로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-800 dark:text-white font-sans pb-24 md:pb-10 transition-colors">
            {/* Demo Banner */}
            {isDemo && <DemoBanner />}

            {/* Header */}
            <Header
                subscriptionCount={activeCount}
                onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* Main content */}
            <main className={`max-w-lg mx-auto px-4 py-6 space-y-6 ${isDemo ? 'pt-16' : ''}`}>
                {/* Total Cost Card */}
                <TotalCostCard
                    totalMonthlyCost={totalMonthlyCost}
                    totalYearlyCost={totalYearlyCost}
                    subscriptions={subscriptionsWithDaysLeft}
                />

                {/* Alerts */}
                <AlertCard items={alertItems} />

                {/* Dashboard */}
                <Dashboard
                    subscriptions={subscriptionsWithDaysLeft}
                    totalMonthlyCost={totalMonthlyCost}
                    totalYearlyCost={totalYearlyCost}
                    categoryBreakdown={categoryBreakdown}
                    onCategoryClick={handleCategoryClick}
                />

                {/* Filter Bar */}
                {subscriptions.length > 0 && (
                    <FilterBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        showPaused={showPaused}
                        onShowPausedChange={setShowPaused}
                    />
                )}

                {/* Subscription List */}
                <SubscriptionList
                    subscriptions={subscriptionsWithDaysLeft}
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    sortBy={sortBy}
                    showPaused={showPaused}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    onTogglePause={handleTogglePause}
                    onAddNew={() => handleOpenModal()}
                />
            </main>

            {/* FAB */}
            <button
                onClick={() => handleOpenModal()}
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-xl shadow-primary-500/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40 fab-pulse"
                aria-label="새 구독 추가"
            >
                <Plus size={24} />
            </button>

            {/* Modals */}
            <SubscriptionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                editData={editData}
            />

            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                subscriptions={subscriptions}
                onImport={isDemo ? null : firebaseHook.importSubscriptions}
                onClearAll={isDemo ? null : firebaseHook.clearAllSubscriptions}
            />

            {/* Toast notification */}
            {toast && (
                <div className={`toast ${toast.type === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    }`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-dark-900">
                <div className="w-12 h-12 spinner" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

// Admin Route wrapper
function AdminRoute({ children }) {
    const { isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-dark-900">
                <div className="w-12 h-12 spinner" />
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

// App with Router
function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <HashRouter>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />
                            {/* Admin Route Removed for Local Version */}
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <MainApp />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Suspense>
                </HashRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
