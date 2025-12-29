import { useState, useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useSubscriptions } from './hooks/useSubscriptions';
import { calculateDaysLeft } from './utils/dateHelpers';
import Header from './components/Header';
import TotalCostCard from './components/TotalCostCard';
import AlertCard from './components/AlertCard';
import Dashboard from './components/Dashboard';
import FilterBar from './components/FilterBar';
import SubscriptionList from './components/SubscriptionList';
import SubscriptionModal from './components/SubscriptionModal';
import SettingsPanel from './components/SettingsPanel';

function App() {
    const { user, loading: authLoading, error: authError } = useAuth();
    const {
        subscriptions,
        loading: subsLoading,
        error: subsError,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        togglePause,
        importSubscriptions,
        clearAllSubscriptions,
        totalMonthlyCost,
        totalYearlyCost,
        sortedByDate,
        upcomingPayments,
        categoryBreakdown,
        activeCount,
    } = useSubscriptions(user);

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
                await updateSubscription(id, data);
                showToast('구독이 수정되었습니다');
            } else {
                await addSubscription(data);
                showToast('새 구독이 추가되었습니다');
            }
        } catch (error) {
            showToast('저장 중 오류가 발생했습니다', 'error');
            console.error(error);
        }
    }, [addSubscription, updateSubscription, showToast]);

    const handleDelete = useCallback(async (id) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            await deleteSubscription(id);
            showToast('구독이 삭제되었습니다');
        } catch (error) {
            showToast('삭제 중 오류가 발생했습니다', 'error');
            console.error(error);
        }
    }, [deleteSubscription, showToast]);

    const handleTogglePause = useCallback(async (id) => {
        try {
            await togglePause(id);
            const sub = subscriptions.find(s => s.id === id);
            showToast(sub?.isPaused ? '구독이 재개되었습니다' : '구독이 일시정지되었습니다');
        } catch (error) {
            showToast('상태 변경 중 오류가 발생했습니다', 'error');
            console.error(error);
        }
    }, [togglePause, subscriptions, showToast]);

    const handleImport = useCallback(async (data) => {
        try {
            const count = await importSubscriptions(data);
            showToast(`${count}개의 구독을 가져왔습니다`);
            return count;
        } catch (error) {
            showToast('가져오기 중 오류가 발생했습니다', 'error');
            throw error;
        }
    }, [importSubscriptions, showToast]);

    const handleClearAll = useCallback(async () => {
        try {
            await clearAllSubscriptions();
            showToast('모든 데이터가 삭제되었습니다');
        } catch (error) {
            showToast('삭제 중 오류가 발생했습니다', 'error');
            throw error;
        }
    }, [clearAllSubscriptions, showToast]);

    const handleCategoryClick = useCallback((category) => {
        setSelectedCategory(prev => prev === category ? null : category);
    }, []);

    // Loading state
    if (authLoading || subsLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-dark-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 spinner" />
                    <p className="text-gray-500 dark:text-dark-400 text-sm">로딩 중...</p>
                </div>
            </div>
        );
    }

    // Auth error state
    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-dark-900 p-8">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        로그인이 필요합니다
                    </h2>
                    <p className="text-gray-500 dark:text-dark-400 text-sm">
                        {authError || '인증에 실패했습니다. 잠시 후 다시 시도해주세요.'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-800 dark:text-white font-sans pb-24 md:pb-10 transition-colors">
            {/* Header */}
            <Header
                subscriptionCount={activeCount}
                onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* Main content */}
            <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
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
                onImport={handleImport}
                onClearAll={handleClearAll}
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

export default App;
