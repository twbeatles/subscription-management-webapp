import { useMemo } from 'react';
import { PieChart, BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import DonutChart from './DonutChart';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/constants';

export default function Dashboard({
    subscriptions,
    totalMonthlyCost,
    totalYearlyCost,
    categoryBreakdown,
    onCategoryClick
}) {
    // Calculate monthly trend data (simulated - in real app would come from historical data)
    const monthlyData = useMemo(() => {
        const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        const currentMonth = new Date().getMonth();

        // Generate last 6 months of data (simulated)
        return Array.from({ length: 6 }, (_, i) => {
            const monthIndex = (currentMonth - 5 + i + 12) % 12;
            const variance = Math.random() * 0.3 - 0.15; // ±15% variance
            const cost = Math.round(totalMonthlyCost * (1 + variance));
            return {
                month: months[monthIndex],
                cost: i === 5 ? totalMonthlyCost : cost,
                isCurrentMonth: i === 5
            };
        });
    }, [totalMonthlyCost]);

    // Find max for bar chart scaling
    const maxCost = Math.max(...monthlyData.map(d => d.cost));

    // Top categories
    const sortedCategories = useMemo(() => {
        return Object.entries(categoryBreakdown)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 5);
    }, [categoryBreakdown]);

    // Most expensive subscription
    const mostExpensive = useMemo(() => {
        return [...subscriptions]
            .filter(s => !s.isPaused)
            .sort((a, b) => b.cost - a.cost)[0];
    }, [subscriptions]);

    const activeSubscriptions = subscriptions.filter(s => !s.isPaused);

    if (subscriptions.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* Analytics header */}
            <section className="bg-white dark:bg-dark-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm">
                        <PieChart className="w-4 h-4 text-primary-500" />
                        지출 분석
                    </h3>
                    <span className="text-[10px] text-gray-400 dark:text-dark-500 bg-gray-100 dark:bg-dark-700 px-2 py-1 rounded-full">
                        {activeSubscriptions.length}개 활성
                    </span>
                </div>
                <DonutChart data={activeSubscriptions} onCategoryClick={onCategoryClick} />
            </section>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-3">
                {/* Monthly average */}
                <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-dark-400 mb-2">
                        <DollarSign size={14} />
                        <span className="text-xs">월 평균</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {Math.round(totalMonthlyCost).toLocaleString()}
                        <span className="text-sm font-normal text-gray-400 dark:text-dark-500 ml-0.5">원</span>
                    </div>
                </div>

                {/* Yearly total */}
                <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-dark-400 mb-2">
                        <Calendar size={14} />
                        <span className="text-xs">연간 예상</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {Math.round(totalYearlyCost / 10000).toLocaleString()}
                        <span className="text-sm font-normal text-gray-400 dark:text-dark-500 ml-0.5">만원</span>
                    </div>
                </div>
            </div>

            {/* Monthly trend chart */}
            <section className="bg-white dark:bg-dark-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm">
                        <BarChart3 className="w-4 h-4 text-primary-500" />
                        월별 추이
                    </h3>
                    <span className="text-[10px] text-gray-400 dark:text-dark-500">
                        최근 6개월
                    </span>
                </div>

                {/* Bar chart */}
                <div className="flex items-end justify-between gap-2 h-32">
                    {monthlyData.map((data, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                            <div
                                className={`w-full rounded-t-lg transition-all ${data.isCurrentMonth
                                        ? 'bg-gradient-to-t from-primary-500 to-primary-400'
                                        : 'bg-gray-200 dark:bg-dark-600'
                                    }`}
                                style={{
                                    height: `${(data.cost / maxCost) * 100}%`,
                                    minHeight: '8px'
                                }}
                            />
                            <span className={`text-[10px] ${data.isCurrentMonth
                                    ? 'text-primary-600 dark:text-primary-400 font-bold'
                                    : 'text-gray-400 dark:text-dark-500'
                                }`}>
                                {data.month}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Category breakdown */}
            {sortedCategories.length > 0 && (
                <section className="bg-white dark:bg-dark-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-primary-500" />
                            카테고리별
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {sortedCategories.map(([category, data]) => {
                            const percentage = (data.total / totalMonthlyCost) * 100;
                            const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.Etc;

                            return (
                                <button
                                    key={category}
                                    onClick={() => onCategoryClick?.(category)}
                                    className="w-full text-left hover:bg-gray-50 dark:hover:bg-dark-700 rounded-xl p-2 -mx-2 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="text-sm font-medium text-gray-700 dark:text-dark-300">
                                                {CATEGORY_LABELS[category] || category}
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-dark-500">
                                                ({data.count}개)
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            {data.total.toLocaleString()}원
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: color
                                            }}
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Most expensive */}
            {mostExpensive && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">
                        💰 가장 비싼 구독
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">
                            {mostExpensive.name}
                        </span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                            {mostExpensive.cost.toLocaleString()}원/월
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
