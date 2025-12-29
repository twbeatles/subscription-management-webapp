import {
    ExternalLink,
    Edit2,
    Trash2,
    Pause,
    Play,
    Globe,
    Clock,
    AlertTriangle
} from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/constants';
import { getDaysUntilTrialEnd } from '../utils/dateHelpers';

export default function SubscriptionCard({
    subscription,
    onEdit,
    onDelete,
    onTogglePause
}) {
    const {
        id,
        name,
        cost,
        billingDay,
        billingCycle,
        category,
        url,
        customColor,
        isPaused,
        trialEndDate,
        daysLeft
    } = subscription;

    const color = customColor || CATEGORY_COLORS[category] || CATEGORY_COLORS.Etc;
    const trialDays = getDaysUntilTrialEnd(trialEndDate);
    const isTrialActive = trialDays >= 0;

    return (
        <div
            className={`group bg-white dark:bg-dark-800 p-4 rounded-2xl shadow-sm border transition-all card-hover ${isPaused
                    ? 'border-gray-200 dark:border-dark-700 opacity-60'
                    : daysLeft <= 3
                        ? 'border-red-200 dark:border-red-900/50'
                        : 'border-gray-100 dark:border-dark-700 hover:border-primary-200 dark:hover:border-primary-800'
                }`}
        >
            <div className="flex items-center justify-between">
                {/* Left side: Icon and info */}
                <div className="flex items-center gap-3 min-w-0">
                    {/* Service icon */}
                    <div
                        className={`relative w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md transition-transform group-hover:scale-105 ${isPaused ? 'grayscale' : ''
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {name.slice(0, 1).toUpperCase()}
                        {isPaused && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center">
                                <Pause size={10} className="text-white" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5 truncate">
                            {name}
                            {url && <Globe size={10} className="text-gray-300 dark:text-dark-500 flex-shrink-0" />}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-400 mt-0.5 flex-wrap">
                            <span
                                className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                                style={{
                                    backgroundColor: `${color}15`,
                                    color: color
                                }}
                            >
                                {CATEGORY_LABELS[category] || category}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={10} />
                                매월 {billingDay}일
                            </span>
                            {billingCycle && billingCycle !== 'monthly' && (
                                <span className="text-primary-500 dark:text-primary-400 font-medium">
                                    {billingCycle === 'yearly' ? '연간' : '주간'}
                                </span>
                            )}
                        </div>
                        {/* Trial badge */}
                        {isTrialActive && (
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-600 dark:text-amber-400">
                                <AlertTriangle size={10} />
                                무료체험 D-{trialDays}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side: Cost and D-day */}
                <div className="text-right flex-shrink-0 ml-2">
                    <div className={`font-bold text-sm ${isPaused ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                        {cost.toLocaleString()}원
                    </div>
                    <div className={`text-[10px] font-bold mt-0.5 ${isPaused
                            ? 'text-gray-400 dark:text-dark-500'
                            : daysLeft === 0
                                ? 'text-red-600 dark:text-red-400 animate-pulse'
                                : daysLeft <= 3
                                    ? 'text-red-500 dark:text-red-400'
                                    : 'text-primary-500 dark:text-primary-400'
                        }`}>
                        {isPaused ? '일시정지' : daysLeft === 0 ? 'Today!' : `D-${daysLeft}`}
                    </div>
                </div>
            </div>

            {/* Action bar */}
            <div className="pt-3 mt-3 border-t border-gray-50 dark:border-dark-700 flex justify-end items-center gap-2">
                {/* Visit service button */}
                {url && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                    >
                        <ExternalLink size={12} />
                        서비스 이동
                    </a>
                )}

                {/* Pause/Resume button */}
                <button
                    onClick={() => onTogglePause(id)}
                    className={`p-1.5 rounded-lg transition-colors ${isPaused
                            ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                            : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                        }`}
                    title={isPaused ? '재개' : '일시정지'}
                >
                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                </button>

                {/* Edit button */}
                <button
                    onClick={() => onEdit(subscription)}
                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors"
                    title="수정"
                >
                    <Edit2 size={16} />
                </button>

                {/* Delete button */}
                <button
                    onClick={() => onDelete(id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="삭제"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
