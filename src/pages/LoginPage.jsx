import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Chrome,
    Play,
    ArrowRight,
    CreditCard,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const {
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        startDemoMode,
        error,
        clearError
    } = useAuth();

    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: ''
    });
    const [formError, setFormError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormError('');
        clearError();
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setFormError('이메일과 비밀번호를 입력해주세요');
            return false;
        }

        if (mode === 'signup') {
            if (!formData.displayName) {
                setFormError('이름을 입력해주세요');
                return false;
            }
            if (formData.password.length < 6) {
                setFormError('비밀번호는 6자 이상이어야 합니다');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setFormError('비밀번호가 일치하지 않습니다');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            if (mode === 'login') {
                await signInWithEmail(formData.email, formData.password);
            } else {
                await signUpWithEmail(formData.email, formData.password, formData.displayName);
            }
            navigate('/');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            navigate('/');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDemoMode = () => {
        startDemoMode();
        navigate('/');
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setFormError('');
        clearError();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-violet-800 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-xl mb-4">
                        <CreditCard className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">구독 매니저</h1>
                    <p className="text-white/60 text-sm mt-1">Pro Edition</p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl p-8">
                    {/* Tabs */}
                    <div className="flex bg-gray-100 dark:bg-dark-700 rounded-xl p-1 mb-6">
                        <button
                            onClick={() => toggleMode()}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === 'login'
                                    ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-dark-400'
                                }`}
                        >
                            로그인
                        </button>
                        <button
                            onClick={() => toggleMode()}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === 'signup'
                                    ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-dark-400'
                                }`}
                        >
                            회원가입
                        </button>
                    </div>

                    {/* Error message */}
                    {(error || formError) && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircle size={16} />
                            {error || formError}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                    이름
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="displayName"
                                        value={formData.displayName}
                                        onChange={handleChange}
                                        placeholder="홍길동"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                이메일
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                비밀번호
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {mode === 'signup' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                    비밀번호 확인
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {mode === 'login' && (
                            <div className="text-right">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    비밀번호를 잊으셨나요?
                                </Link>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {mode === 'login' ? '로그인' : '회원가입'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-dark-600" />
                        <span className="text-sm text-gray-400 dark:text-dark-500">또는</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-dark-600" />
                    </div>

                    {/* Social login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full py-3 border border-gray-200 dark:border-dark-600 rounded-xl font-medium text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all flex items-center justify-center gap-3"
                    >
                        <Chrome size={20} className="text-blue-500" />
                        Google로 계속하기
                    </button>

                    {/* Demo mode */}
                    <button
                        onClick={handleDemoMode}
                        className="w-full mt-3 py-3 bg-gray-100 dark:bg-dark-700 rounded-xl font-medium text-gray-600 dark:text-dark-300 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all flex items-center justify-center gap-2"
                    >
                        <Play size={18} />
                        로그인 없이 체험하기
                    </button>

                    <p className="text-center text-xs text-gray-400 dark:text-dark-500 mt-4">
                        체험 모드는 30분간 유지되며, 데이터는 임시 저장됩니다
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-white/40 text-xs mt-6">
                    계속 진행하면 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다
                </p>
            </div>
        </div>
    );
}
