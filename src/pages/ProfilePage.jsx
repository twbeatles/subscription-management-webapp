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
                    </button> // Cleaned up closing tag
                </div>
            </div>

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
    );
}
