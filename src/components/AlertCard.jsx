import { AlertCircle, Bell } from 'lucide-react';

export default function AlertCard({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-4 shadow-sm border-l-4 border-red-500 dark:border-red-400 flex items-start gap-3 animate-fade-in">
            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full text-red-500 dark:text-red-400 flex-shrink-0">
                <AlertCircle size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                    곧 결제되는 서비스
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                        {items.length}
                    </span>
                </h3>
                <div className="mt-2 space-y-1.5">
                    {items.map(item => (
                        <div
                            key={item.id}
                            className="text-sm flex justify-between items-center py-1 border-b border-gray-50 dark:border-dark-700 last:border-0"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <span
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{
                                        backgroundColor: item.customColor || '#E50914'
                                    }}
                                />
                                <span className="text-gray-600 dark:text-dark-300 truncate">
                                    {item.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs text-gray-400 dark:text-dark-500">
                                    {item.cost.toLocaleString()}원
                                </span>
                                <span className={`font-bold text-xs px-2 py-0.5 rounded ${item.daysLeft === 0
                                        ? 'bg-red-500 text-white'
                                        : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                    }`}>
                                    {item.daysLeft === 0 ? '오늘' : `D-${item.daysLeft}`}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
