import { useState } from 'react';
import { PieChart } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/constants';

export default function DonutChart({ data, onCategoryClick }) {
    const [hoveredId, setHoveredId] = useState(null);

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-dark-500 bg-gray-50 dark:bg-dark-800 rounded-2xl border border-dashed border-gray-200 dark:border-dark-700">
                <PieChart className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs">데이터가 없습니다</p>
            </div>
        );
    }

    const total = data.reduce((acc, cur) => acc + cur.cost, 0);
    let cumulativePercent = 0;

    const getCoordinatesForPercent = (percent) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    const slices = data.map((item) => {
        const percent = item.cost / total;
        const start = cumulativePercent;
        cumulativePercent += percent;
        const end = cumulativePercent;

        const [startX, startY] = getCoordinatesForPercent(start);
        const [endX, endY] = getCoordinatesForPercent(end);
        const largeArcFlag = percent > 0.5 ? 1 : 0;

        const pathData = [
            `M 0 0`,
            `L ${startX} ${startY}`,
            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            `L 0 0`,
        ].join(' ');

        const color = item.customColor || CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Etc;
        const isHovered = hoveredId === item.id;

        return (
            <path
                key={item.id}
                d={pathData}
                fill={color}
                className="chart-segment cursor-pointer"
                style={{
                    opacity: hoveredId && !isHovered ? 0.5 : 1,
                    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onCategoryClick?.(item.category)}
            />
        );
    });

    const hoveredItem = data.find(item => item.id === hoveredId);

    return (
        <div className="flex items-center gap-6">
            {/* Chart */}
            <div className="relative w-36 h-36 flex-shrink-0">
                <svg viewBox="-1.1 -1.1 2.2 2.2" className="transform -rotate-90 w-full h-full drop-shadow-sm">
                    {slices}
                </svg>
                {/* Center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 bg-white dark:bg-dark-800 rounded-full flex flex-col items-center justify-center shadow-inner dark:shadow-dark-900/50">
                        {hoveredItem ? (
                            <>
                                <span className="text-xs font-bold text-gray-800 dark:text-white truncate max-w-[70px]">
                                    {hoveredItem.name}
                                </span>
                                <span className="text-[10px] text-gray-500 dark:text-dark-400">
                                    {Math.round((hoveredItem.cost / total) * 100)}%
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-[10px] text-gray-400 dark:text-dark-500">이번달</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-white">
                                    {Math.round(total / 10000)}만원
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex-1 grid grid-cols-1 gap-1.5 text-xs max-h-36 overflow-y-auto scrollbar-hide">
                {data.slice(0, 6).map((item) => {
                    const color = item.customColor || CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Etc;
                    const isHovered = hoveredId === item.id;

                    return (
                        <div
                            key={item.id}
                            className={`flex items-center justify-between p-1.5 rounded-lg transition-all cursor-pointer ${isHovered ? 'bg-gray-100 dark:bg-dark-700' : ''
                                }`}
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => onCategoryClick?.(item.category)}
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="truncate max-w-[80px] text-gray-600 dark:text-dark-300">
                                    {item.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 dark:text-dark-500 text-[10px]">
                                    {item.cost.toLocaleString()}원
                                </span>
                                <span className="font-semibold text-gray-800 dark:text-white w-8 text-right">
                                    {Math.round((item.cost / total) * 100)}%
                                </span>
                            </div>
                        </div>
                    );
                })}
                {data.length > 6 && (
                    <div className="text-gray-400 dark:text-dark-500 pl-4 text-[10px]">
                        ...외 {data.length - 6}개
                    </div>
                )}
            </div>
        </div>
    );
}
