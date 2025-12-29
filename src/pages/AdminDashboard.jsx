import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Users,
    CreditCard,
    TrendingUp,
    Shield,
    Search,
    MoreVertical,
    UserCheck,
    UserX,
    Crown
} from 'lucide-react';
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { isAdmin, user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSubscriptions: 0,
        totalMonthlyRevenue: 0,
        activeUsers: 0
    });

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }

        fetchUsers();
    }, [isAdmin, navigate]);

    const fetchUsers = async () => {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setUsers(usersData);

            // Calculate stats
            const totalSubs = usersData.reduce((acc, u) => acc + (u.subscriptionCount || 0), 0);
            const totalRevenue = usersData.reduce((acc, u) => acc + (u.totalMonthlyCost || 0), 0);
            const activeCount = usersData.filter(u => !u.isDisabled).length;

            setStats({
                totalUsers: usersData.length,
                totalSubscriptions: totalSubs,
                totalMonthlyRevenue: totalRevenue,
                activeUsers: activeCount
            });
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserDisabled = async (userId, currentStatus) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { isDisabled: !currentStatus });
            setUsers(users.map(u =>
                u.id === userId ? { ...u, isDisabled: !currentStatus } : u
            ));
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    const toggleUserAdmin = async (userId, currentStatus) => {
        if (userId === user.uid) {
            alert('자신의 관리자 권한은 변경할 수 없습니다');
            return;
        }

        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { isAdmin: !currentStatus });
            setUsers(users.map(u =>
                u.id === userId ? { ...u, isAdmin: !currentStatus } : u
            ));
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pb-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm"
                    >
                        <ArrowLeft size={18} />
                        돌아가기
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">관리자 대시보드</h1>
                            <p className="text-white/70 text-sm">사용자 및 시스템 관리</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-white dark:bg-dark-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-dark-700">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-dark-400 mb-2">
                            <Users size={16} />
                            <span className="text-xs">총 사용자</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats.totalUsers}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-dark-700">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-dark-400 mb-2">
                            <UserCheck size={16} />
                            <span className="text-xs">활성 사용자</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {stats.activeUsers}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-dark-700">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-dark-400 mb-2">
                            <CreditCard size={16} />
                            <span className="text-xs">총 구독 수</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats.totalSubscriptions}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-dark-700">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-dark-400 mb-2">
                            <TrendingUp size={16} />
                            <span className="text-xs">총 월 지출</span>
                        </div>
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {Math.round(stats.totalMonthlyRevenue / 10000)}만
                        </div>
                    </div>
                </div>

                {/* User List */}
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-dark-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-gray-900 dark:text-white">사용자 목록</h2>
                            <span className="text-xs text-gray-400 dark:text-dark-500">{filteredUsers.length}명</span>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="이메일 또는 이름으로 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-dark-700">
                            {filteredUsers.map(u => (
                                <div key={u.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${u.isDisabled ? 'bg-gray-400' : 'bg-primary-500'
                                            }`}>
                                            {u.displayName?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-medium truncate ${u.isDisabled ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'
                                                    }`}>
                                                    {u.displayName || '이름 없음'}
                                                </span>
                                                {u.isAdmin && (
                                                    <Crown size={12} className="text-amber-500 flex-shrink-0" />
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-dark-400 truncate">
                                                {u.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="hidden md:block text-right">
                                            <div className="text-sm text-gray-600 dark:text-dark-300">
                                                {u.subscriptionCount || 0}개 구독
                                            </div>
                                            <div className="text-xs text-gray-400 dark:text-dark-500">
                                                가입: {formatDate(u.createdAt)}
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-lg transition-colors">
                                                <MoreVertical size={16} className="text-gray-400" />
                                            </button>

                                            {/* Dropdown */}
                                            <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-dark-700 rounded-xl shadow-lg border border-gray-100 dark:border-dark-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                <button
                                                    onClick={() => toggleUserAdmin(u.id, u.isAdmin)}
                                                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-600 flex items-center gap-2 first:rounded-t-xl"
                                                >
                                                    <Crown size={14} />
                                                    {u.isAdmin ? '관리자 해제' : '관리자 지정'}
                                                </button>
                                                <button
                                                    onClick={() => toggleUserDisabled(u.id, u.isDisabled)}
                                                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 last:rounded-b-xl ${u.isDisabled
                                                            ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                            : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                        }`}
                                                >
                                                    {u.isDisabled ? <UserCheck size={14} /> : <UserX size={14} />}
                                                    {u.isDisabled ? '계정 활성화' : '계정 비활성화'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredUsers.length === 0 && (
                                <div className="p-8 text-center text-gray-400 dark:text-dark-500">
                                    {searchQuery ? '검색 결과가 없습니다' : '사용자가 없습니다'}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
