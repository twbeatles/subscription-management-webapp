import { Search, Filter, ChevronDown } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_LABELS, SORT_OPTIONS } from '../utils/constants';

export default function FilterBar({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    sortBy,
    onSortChange,
    showPaused,
    onShowPausedChange
}) {
    const categories = ['All', ...Object.keys(CATEGORY_COLORS)];

    return (
        <div className="space-y-3">
            {/* Search bar */}
            <div className="relative">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-500"
                />
                <input
                    type="text"
                    placeholder="구독 서비스 검색..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-dark-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                />
            </div>

            {/* Filters row */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                {/* Category pills */}
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat === 'All' ? null : cat)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${(cat === 'All' && !selectedCategory) || selectedCategory === cat
                                ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
                                : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-dark-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                            }`}
                    >
                        {cat !== 'All' && (
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                            />
                        )}
                        {cat === 'All' ? '전체' : CATEGORY_LABELS[cat] || cat}
                    </button>
                ))}
            </div>

            {/* Sort and toggle row */}
            <div className="flex items-center justify-between">
                {/* Sort dropdown */}
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-600 dark:text-dark-300 text-xs font-medium cursor-pointer focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                        {SORT_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        size={12}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                </div>

                {/* Show paused toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-gray-500 dark:text-dark-400">일시정지 포함</span>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={showPaused}
                            onChange={(e) => onShowPausedChange(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 dark:bg-dark-700 rounded-full peer peer-checked:bg-primary-500 transition-colors" />
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                    </div>
                </label>
            </div>
        </div>
    );
}
