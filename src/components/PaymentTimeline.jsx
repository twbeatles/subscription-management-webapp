import { useMemo } from 'react';
import { CATEGORY_COLORS } from '../utils/constants';

export default function PaymentTimeline({ items }) {
    const today = new Date().getDate();

    const sortedItems = useMemo(() => {
        return [...items]
            .filter(item => !item.isPaused)
            .sort((a, b) => {
                let dayA = a.billingDay < today ? a.billingDay + 31 : a.billingDay;
                let dayB = b.billingDay < today ? b.billingDay + 31 : b.billingDay;
                return dayA - dayB;
            });
    }, [items, today]);

    if (sortedItems.length === 0) {
        return (
            <div className="text-xs text-white/60 text-center py-4">
                결제 예정인 구독이 없습니다
            </div>
        );
    }

    const displayItems = sortedItems.slice(0, 7);
    const daysInMonth = 31;

    return (
        <div className="relative pt-2 pb-4">
            {/* Timeline bar */}
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                {/* Progress segments */}
                {displayItems.map((item, idx) => {
                    const dayPosition = item.billingDay < today
                        ? (item.billingDay + 31 - today) / 31
                        : (item.billingDay - today) / 31;
                    const color = item.customColor || CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Etc;

                    return (
                        <div
                            key={item.id}
                            className="absolute h-full w-1 rounded-full transition-all"
                            style={{
                                left: `${dayPosition * 100}%`,
                                backgroundColor: color,
                            }}
                        />
                    );
                })}
            </div>

            {/* Items */}
            <div className="flex justify-between mt-4 px-1">
                {displayItems.slice(0, 5).map((item, idx) => {
                    const isPast = item.billingDay < today;
                    const isToday = item.billingDay === today;
                    const color = item.customColor || CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Etc;

                    return (
                        <div
                            key={item.id}
                            className="flex flex-col items-center group cursor-pointer"
                            style={{ flex: `0 0 ${100 / 5}%` }}
                        >
                            {/* Dot */}
                            <div
                                className={`w-3 h-3 rounded-full border-2 transition-all ${isToday
                                        ? 'animate-pulse scale-125'
                                        : isPast
                                            ? 'opacity-40'
                                            : 'group-hover:scale-110'
                                    }`}
                                style={{
                                    backgroundColor: color,
                                    borderColor: 'rgba(255,255,255,0.5)'
                                }}
                            />

                            {/* Date */}
                            <span className={`text-[10px] font-semibold mt-1.5 ${isToday ? 'text-white' : isPast ? 'text-white/40' : 'text-white/80'
                                }`}>
                                {isToday ? '오늘' : `${item.billingDay}일`}
                            </span>

                            {/* Name */}
                            <span className={`text-[10px] truncate w-full text-center ${isToday ? 'text-white font-bold' : isPast ? 'text-white/40' : 'text-white/70'
                                }`}>
                                {item.name.length > 6 ? item.name.slice(0, 6) + '..' : item.name}
                            </span>

                            {/* Cost on hover */}
                            <span className="text-[9px] text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.cost.toLocaleString()}원
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Show more indicator */}
            {sortedItems.length > 5 && (
                <div className="text-center mt-2">
                    <span className="text-[10px] text-white/40">
                        +{sortedItems.length - 5}개 더 있음
                    </span>
                </div>
            )}
        </div>
    );
}
