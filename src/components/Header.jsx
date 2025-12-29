import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Moon, Sun, Settings, User, LogOut, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ subscriptionCount, onOpenSettings }) {
    const { isDark, toggleTheme } = useTheme();
    const { user, userProfile, isAdmin, isDemo, signOut } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const displayName = userProfile?.displayName || user?.displayName || (isDemo ? '체험 중' : '사용자');
    const photoURL = userProfile?.photoURL || user?.photoURL;

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

                    {/* User profile menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                        >
                            <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-medium overflow-hidden">
                                {photoURL ? (
                                    <img src={photoURL} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    displayName[0]?.toUpperCase() || 'U'
                                )}
                            </div>
                        </button>

                        {/* Dropdown menu */}
                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-700 rounded-xl shadow-lg border border-gray-100 dark:border-dark-600 z-20 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-600">
                                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                            {displayName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-dark-400 truncate">
                                            {user?.email || '체험 모드'}
                                        </p>
                                    </div>

                                    <div className="py-1">
                                        {!isDemo && (
                                            <button
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    navigate('/profile');
                                                }}
                                                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-600 flex items-center gap-2"
                                            >
                                                <User size={16} />
                                                프로필 설정
                                            </button>
                                        )}

                                        {isAdmin && (
                                            <button
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    navigate('/admin');
                                                }}
                                                className="w-full px-4 py-2.5 text-left text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 flex items-center gap-2"
                                            >
                                                <Shield size={16} />
                                                관리자 대시보드
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                setShowMenu(false);
                                                handleSignOut();
                                            }}
                                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-600 flex items-center gap-2"
                                        >
                                            <LogOut size={16} />
                                            {isDemo ? '체험 종료' : '로그아웃'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
