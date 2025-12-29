import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, X, UserPlus } from 'lucide-react';
import { getDemoModeInfo } from '../utils/demoData';

export default function DemoBanner({ onSignUp }) {
    const navigate = useNavigate();
    const [demoInfo, setDemoInfo] = useState(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const updateInfo = () => {
            const info = getDemoModeInfo();
            setDemoInfo(info);
        };

        updateInfo();
        const interval = setInterval(updateInfo, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    if (!demoInfo || dismissed) return null;

    const isUrgent = demoInfo.remainingMinutes <= 5;

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 ${isUrgent
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            } text-white py-2 px-4 shadow-lg`}>
            <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="animate-pulse" />
                    <span>
                        <strong>체험 모드</strong> - {demoInfo.remainingMinutes}분 후 데이터가 사라집니다
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors"
                    >
                        <UserPlus size={14} />
                        가입하고 저장하기
                    </button>
                    <button
                        onClick={() => setDismissed(true)}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
