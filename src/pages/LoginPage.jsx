import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { localStorageManager } from '../utils/localStorageManager';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const [users, setUsers] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        const loadedUsers = localStorageManager.getUsers();
        setUsers(loadedUsers);
        if (loadedUsers.length === 0) setIsCreating(true);
    };

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        if (!newUserName.trim()) return;

        try {
            await register(newUserName);
            navigate('/');
        } catch (err) {
            setError('프로필 생성 중 오류가 발생했습니다.');
        }
    };

    const handleProfileSelect = async (userId) => {
        try {
            await login(userId);
            navigate('/');
        } catch (err) {
            setError('로그인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 p-4 transition-colors">
            <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden transition-all p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">구독 관리자</h1>
                    <p className="text-gray-500 dark:text-dark-400">
                        {isCreating ? '새 프로필 만들기' : '프로필 선택'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-500 text-sm dark:bg-red-900/20 dark:text-red-400 text-center">
                        {error}
                    </div>
                )}

                {isCreating ? (
                    <form onSubmit={handleCreateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                이름 (닉네임)
                            </label>
                            <input
                                type="text"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                                placeholder="예: 홍길동"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <UserPlus size={20} /> 프로필 생성 및 시작
                        </button>
                        {users.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="w-full py-3 px-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            >
                                기존 프로필 선택하기
                            </button>
                        )}
                    </form>
                ) : (
                    <div className="space-y-3">
                        <div className="grid gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                            {users.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleProfileSelect(user.id)}
                                    className="w-full p-4 flex items-center gap-3 bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-xl transition-all text-left group border border-transparent hover:border-primary-200 dark:hover:border-primary-800"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg group-hover:scale-110 transition-transform">
                                        {user.displayName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {user.displayName}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-dark-400">
                                            {new Date(user.createdAt).toLocaleDateString()} 가입
                                        </p>
                                    </div>
                                    <LogIn size={18} className="text-gray-300 dark:text-dark-500 group-hover:text-primary-500" />
                                </button>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-dark-700 mt-4">
                            <button
                                onClick={() => setIsCreating(true)}
                                className="w-full py-3 px-4 border border-dashed border-gray-300 dark:border-dark-600 text-gray-500 dark:text-dark-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <UserPlus size={18} /> 새 프로필 추가
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
