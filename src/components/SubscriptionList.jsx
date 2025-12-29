import { useMemo } from 'react';
import { TrendingUp, Plus } from 'lucide-react';
import SubscriptionCard from './SubscriptionCard';

export default function SubscriptionList({
    subscriptions,
    searchQuery,
    selectedCategory,
    sortBy,
    showPaused,
    onEdit,
    onDelete,
    onTogglePause,
    onAddNew
}) {
    // Filter and sort subscriptions
    const filteredSubscriptions = useMemo(() => {
        let result = [...subscriptions];

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(sub =>
                sub.name.toLowerCase().includes(query) ||
                sub.category.toLowerCase().includes(query)
            );
        }

        // Filter by category
        if (selectedCategory) {
            result = result.filter(sub => sub.category === selectedCategory);
        }

        // Filter by paused status
        if (!showPaused) {
            result = result.filter(sub => !sub.isPaused);
        }

        // Sort
        switch (sortBy) {
            case 'daysLeft':
                result.sort((a, b) => (a.daysLeft || 0) - (b.daysLeft || 0));
                break;
            case 'cost-desc':
                result.sort((a, b) => b.cost - a.cost);
                break;
            case 'cost-asc':
                result.sort((a, b) => a.cost - b.cost);
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
                break;
            case 'category':
                result.sort((a, b) => a.category.localeCompare(b.category));
                break;
            default:
                break;
        }

        return result;
    }, [subscriptions, searchQuery, selectedCategory, sortBy, showPaused]);

    // Group by category if sorting by category
    const groupedSubscriptions = useMemo(() => {
        if (sortBy !== 'category') return null;

        const groups = {};
        filteredSubscriptions.forEach(sub => {
            if (!groups[sub.category]) {
                groups[sub.category] = [];
            }
            groups[sub.category].push(sub);
        });
        return groups;
    }, [filteredSubscriptions, sortBy]);

    if (subscriptions.length === 0) {
        return (
            <div className="text-center py-12 bg-white dark:bg-dark-800 rounded-2xl border border-dashed border-gray-200 dark:border-dark-700">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center">
                    <Plus size={24} className="text-gray-400 dark:text-dark-500" />
                </div>
                <p className="text-gray-500 dark:text-dark-400 text-sm mb-4">
                    등록된 구독 서비스가 없습니다.
                </p>
                <button
                    onClick={onAddNew}
                    className="text-primary-600 dark:text-primary-400 text-sm font-bold hover:underline"
                >
                    + 첫 구독 추가하기
                </button>
            </div>
        );
    }

    if (filteredSubscriptions.length === 0) {
        return (
            <div className="text-center py-8 bg-white dark:bg-dark-800 rounded-2xl">
                <p className="text-gray-400 dark:text-dark-500 text-sm">
                    검색 결과가 없습니다.
                </p>
            </div>
        );
    }

    return (
        <section>
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-primary-500" />
                    구독 리스트
                    <span className="text-xs font-normal text-gray-400 dark:text-dark-500">
                        ({filteredSubscriptions.length})
                    </span>
                </h3>
                {sortBy === 'daysLeft' && (
                    <span className="text-[10px] text-gray-400 dark:text-dark-500">결제일 순</span>
                )}
            </div>

            <div className="space-y-3">
                {groupedSubscriptions ? (
                    // Render grouped by category
                    Object.entries(groupedSubscriptions).map(([category, subs]) => (
                        <div key={category}>
                            <h4 className="text-xs font-medium text-gray-500 dark:text-dark-400 mb-2 pl-1">
                                {category} ({subs.length})
                            </h4>
                            <div className="space-y-3">
                                {subs.map(sub => (
                                    <SubscriptionCard
                                        key={sub.id}
                                        subscription={sub}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onTogglePause={onTogglePause}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    // Render flat list
                    filteredSubscriptions.map(sub => (
                        <SubscriptionCard
                            key={sub.id}
                            subscription={sub}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onTogglePause={onTogglePause}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
