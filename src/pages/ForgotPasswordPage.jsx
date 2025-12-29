import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage() {
    const { resetPassword, error, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        clearError();

        try {
            await resetPassword(email);
            setSent(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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
                    <h1 className="text-2xl font-bold text-white">비밀번호 찾기</h1>
                    <p className="text-white/60 text-sm mt-1">이메일로 재설정 링크를 보내드립니다</p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl p-8">
                    {sent ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                이메일을 확인해주세요
                            </h2>
                            <p className="text-gray-500 dark:text-dark-400 text-sm mb-6">
                                <strong>{email}</strong>으로<br />
                                비밀번호 재설정 링크를 보냈습니다
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline"
                            >
                                <ArrowLeft size={16} />
                                로그인으로 돌아가기
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Error message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                        가입한 이메일 주소
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="example@email.com"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        '재설정 링크 보내기'
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-gray-500 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
                                >
                                    <ArrowLeft size={16} />
                                    로그인으로 돌아가기
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
