import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Lock,
    Camera,
    ArrowLeft,
    Save,
    Trash2,
    LogOut,
    Shield,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
    const navigate = useNavigate();
    const {
        user,
        userProfile,
        updateUserProfile,
        changePassword,
        signOut,
        isAdmin
    } = useAuth();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [profileData, setProfileData] = useState({
        displayName: userProfile?.displayName || user?.displayName || '',
        photoURL: userProfile?.photoURL || user?.photoURL || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await updateUserProfile(profileData);
            setMessage({ type: 'success', text: '프로필이 업데이트되었습니다' });
        } catch (err) {
            setMessage({ type: 'error', text: '업데이트 중 오류가 발생했습니다' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: '새 비밀번호가 일치하지 않습니다' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: '비밀번호는 6자 이상이어야 합니다' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            setMessage({ type: 'success', text: '비밀번호가 변경되었습니다' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
        } catch (err) {
            setMessage({ type: 'error', text: '현재 비밀번호가 올바르지 않습니다' });
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const isEmailUser = user?.providerData?.[0]?.providerId === 'password';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pb-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary-600 to-violet-700 text-white">
                <div className="max-w-lg mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm"
                    >
                        <ArrowLeft size={18} />
                        돌아가기
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold overflow-hidden">
                                {profileData.photoURL ? (
                                    <img
                                        src={profileData.photoURL}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    profileData.displayName?.[0]?.toUpperCase() || '?'
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center text-primary-600 shadow-lg">
                                <Camera size={14} />
                            </button>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{profileData.displayName || '사용자'}</h1>
                            <p className="text-white/70 text-sm">{user?.email}</p>
                            {isAdmin && (
                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-medium rounded-full">
                                    <Shield size={10} />
                                    관리자
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-lg mx-auto px-4 -mt-4">
                {/* Message */}
                {message && (
                    <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm ${message.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                        }`}>
                        {message.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                        {message.text}
                    </div>
                )}

                {/* Profile Form */}
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 p-5 mb-4">
                    <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <User size={18} className="text-primary-500" />
                        프로필 정보
                    </h2>

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                이름
                            </label>
                            <input
                                type="text"
                                value={profileData.displayName}
                                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                이메일
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-100 dark:bg-dark-600 text-gray-500 dark:text-dark-400 cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-gray-400 dark:text-dark-500 mt-1">이메일은 변경할 수 없습니다</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={18} />
                                    저장하기
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Password Section */}
                {isEmailUser && (
                    <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 p-5 mb-4">
                        <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Lock size={18} className="text-primary-500" />
                            비밀번호 변경
                        </h2>

                        {showPasswordForm ? (
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                        현재 비밀번호
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                        새 비밀번호
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                        새 비밀번호 확인
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordForm(false)}
                                        className="flex-1 py-2.5 border border-gray-200 dark:border-dark-600 rounded-xl font-medium text-gray-600 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all"
                                    >
                                        변경하기
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="w-full py-3 border border-gray-200 dark:border-dark-600 rounded-xl font-medium text-gray-600 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all"
                            >
                                비밀번호 변경하기
                            </button>
                        )}
                    </div>
                )}

                {/* Admin Link */}
                {isAdmin && (
                    <button
                        onClick={() => navigate('/admin')}
                        className="w-full mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <Shield className="text-amber-600 dark:text-amber-400" size={20} />
                            <span className="font-medium text-amber-800 dark:text-amber-300">관리자 대시보드</span>
                        </div>
                        <ArrowLeft size={18} className="rotate-180 text-amber-600 dark:text-amber-400" />
                    </button>
                )}

                {/* Sign Out */}
                <button
                    onClick={handleSignOut}
                    className="w-full mb-4 p-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl flex items-center gap-3 text-gray-600 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">로그아웃</span>
                </button>

                {/* Delete Account */}
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/50 p-5">
                    <h2 className="font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                        <Trash2 size={18} />
                        계정 삭제
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-dark-400 mb-4">
                        계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                    </p>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full py-2.5 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        >
                            계정 삭제하기
                        </button>
                    ) : (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                            <p className="text-sm text-red-600 dark:text-red-400 mb-3 font-medium">
                                정말로 계정을 삭제하시겠습니까?
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2 bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg text-sm font-medium"
                                >
                                    취소
                                </button>
                                <button
                                    className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
