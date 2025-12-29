import { CreditCard, Moon, Sun, Settings, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Header({ subscriptionCount, onOpenSettings }) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <header className="bg-white dark:bg-dark-800 sticky top-0 z-20 shadow-sm dark:shadow-dark-900/50 transition-colors">
            <div className="max-w-lg mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-500/30">
                        <CreditCard size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                            구독 매니저
                        </h1>
                        <p className="text-[10px] text-gray-400 dark:text-dark-400 -mt-0.5">
                            Pro Edition
                        </p>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    {/* Subscription count badge */}
                    <div className="text-xs font-medium text-gray-500 dark:text-dark-400 bg-gray-100 dark:bg-dark-700 px-3 py-1.5 rounded-full">
                        <span className="text-primary-600 dark:text-primary-400 font-bold">{subscriptionCount}</span>
                        <span className="ml-1">구독중</span>
                    </div>

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl text-gray-500 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                        aria-label="테마 변경"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Settings button */}
                    <button
                        onClick={onOpenSettings}
                        className="p-2 rounded-xl text-gray-500 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                        aria-label="설정"
                    >
                        <Settings size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
