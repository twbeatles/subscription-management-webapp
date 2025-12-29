import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import PaymentTimeline from './PaymentTimeline';

export default function TotalCostCard({
    totalMonthlyCost,
    totalYearlyCost,
    subscriptions,
    previousMonthCost = null
}) {
    const percentChange = previousMonthCost
        ? ((totalMonthlyCost - previousMonthCost) / previousMonthCost * 100).toFixed(1)
        : null;

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-violet-700 dark:from-primary-700 dark:via-primary-800 dark:to-violet-800 rounded-3xl p-6 text-white shadow-xl shadow-primary-500/20 dark:shadow-primary-900/30">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white opacity-[0.07] blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-white opacity-[0.07] blur-xl pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-violet-400 opacity-10 blur-xl pointer-events-none" />

            {/* Monthly cost */}
            <div className="relative">
                <p className="text-white/70 text-sm font-medium mb-1 flex items-center gap-2">
                    이번 달 예상 지출액
                    {percentChange !== null && (
                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-0.5 ${parseFloat(percentChange) > 0
                                ? 'bg-red-500/20 text-red-200'
                                : 'bg-green-500/20 text-green-200'
                            }`}>
                            {parseFloat(percentChange) > 0 ? (
                                <TrendingUp size={10} />
                            ) : (
                                <TrendingDown size={10} />
                            )}
                            {Math.abs(parseFloat(percentChange))}%
                        </span>
                    )}
                </p>

                <div className="flex items-baseline gap-1.5 mb-2">
                    <h2 className="text-4xl font-extrabold tracking-tight">
                        {totalMonthlyCost.toLocaleString()}
                    </h2>
                    <span className="text-xl opacity-80 font-medium">원</span>
                </div>

                {/* Yearly estimate */}
                <div className="flex items-center gap-4 text-sm text-white/60 mb-6">
                    <span>연간 약 {Math.round(totalYearlyCost / 10000).toLocaleString()}만원</span>
                    <span className="text-white/30">|</span>
                    <span>일 평균 {Math.round(totalMonthlyCost / 30).toLocaleString()}원</span>
                </div>
            </div>

            {/* Payment Timeline */}
            <div className="bg-white/[0.08] backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-white/70 flex items-center gap-1.5">
                        <Calendar size={12} />
                        결제 일정
                    </span>
                    <span className="text-[10px] text-white/50">
                        {new Date().getMonth() + 1}월
                    </span>
                </div>
                <PaymentTimeline items={subscriptions} />
            </div>
        </div>
    );
}
