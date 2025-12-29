import { useState, useEffect } from 'react';
import { X, Check, ExternalLink, Calendar, HelpCircle } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_LABELS, POPULAR_SERVICES, BILLING_CYCLES } from '../utils/constants';

export default function SubscriptionModal({
    isOpen,
    onClose,
    onSave,
    editData = null
}) {
    const [formData, setFormData] = useState({
        name: '',
        cost: '',
        billingDay: 1,
        billingCycle: 'monthly',
        category: 'OTT',
        url: '',
        customColor: '',
        notes: '',
        trialEndDate: ''
    });

    const [errors, setErrors] = useState({});
    const [showPresets, setShowPresets] = useState(true);

    // Reset form when modal opens/closes or edit data changes
    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || '',
                cost: editData.cost || '',
                billingDay: editData.billingDay || 1,
                billingCycle: editData.billingCycle || 'monthly',
                category: editData.category || 'OTT',
                url: editData.url || '',
                customColor: editData.customColor || '',
                notes: editData.notes || '',
                trialEndDate: editData.trialEndDate
                    ? new Date(editData.trialEndDate.seconds * 1000).toISOString().split('T')[0]
                    : ''
            });
            setShowPresets(false);
        } else {
            setFormData({
                name: '',
                cost: '',
                billingDay: new Date().getDate(),
                billingCycle: 'monthly',
                category: 'OTT',
                url: '',
                customColor: '',
                notes: '',
                trialEndDate: ''
            });
            setShowPresets(true);
        }
        setErrors({});
    }, [editData, isOpen]);

    const handlePresetSelect = (preset) => {
        setFormData({
            ...formData,
            name: preset.name,
            category: preset.category,
            url: preset.url,
            customColor: preset.color,
            cost: preset.defaultCost || ''
        });
        setShowPresets(false);
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = '서비스 이름을 입력해주세요';
        }

        if (!formData.cost || isNaN(formData.cost) || Number(formData.cost) < 0) {
            newErrors.cost = '올바른 금액을 입력해주세요';
        }

        if (!formData.billingDay || formData.billingDay < 1 || formData.billingDay > 31) {
            newErrors.billingDay = '1~31 사이의 날짜를 입력해주세요';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        const payload = {
            ...formData,
            cost: Number(formData.cost),
            billingDay: Number(formData.billingDay),
            trialEndDate: formData.trialEndDate ? new Date(formData.trialEndDate) : null
        };

        onSave(payload, editData?.id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-end md:items-center justify-center backdrop-blur-sm modal-backdrop">
            <div className="bg-white dark:bg-dark-800 w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden modal-content max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-dark-700 flex justify-between items-center bg-gray-50/50 dark:bg-dark-900/50 sticky top-0 z-10">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                        {editData ? '구독 정보 수정' : '새 구독 추가'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Quick Select Presets */}
                    {!editData && showPresets && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-dark-400 uppercase tracking-wider mb-2 block">
                                인기 서비스 간편 등록
                            </label>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto scrollbar-hide">
                                {POPULAR_SERVICES.slice(0, 16).map(preset => (
                                    <button
                                        key={preset.name}
                                        type="button"
                                        onClick={() => handlePresetSelect(preset)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-dark-600 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 bg-white dark:bg-dark-700 text-xs font-medium transition-all active:scale-95"
                                    >
                                        <span
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: preset.color }}
                                        />
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPresets(false)}
                                className="text-xs text-gray-400 dark:text-dark-500 mt-2 hover:text-primary-500"
                            >
                                직접 입력하기 →
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Service name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                서비스 이름 *
                            </label>
                            <input
                                type="text"
                                placeholder="예: 넷플릭스"
                                className={`w-full px-4 py-2.5 rounded-xl border ${errors.name
                                        ? 'border-red-400 dark:border-red-500'
                                        : 'border-gray-200 dark:border-dark-600'
                                    } bg-gray-50 dark:bg-dark-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-dark-500 focus:bg-white dark:focus:bg-dark-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all`}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Cost and billing day row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                    결제 금액 *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="0"
                                        min="0"
                                        className={`w-full pl-4 pr-10 py-2.5 rounded-xl border ${errors.cost
                                                ? 'border-red-400 dark:border-red-500'
                                                : 'border-gray-200 dark:border-dark-600'
                                            } bg-gray-50 dark:bg-dark-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all`}
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                    />
                                    <span className="absolute right-3 top-2.5 text-gray-400 dark:text-dark-500 text-sm">원</span>
                                </div>
                                {errors.cost && (
                                    <p className="text-red-500 text-xs mt-1">{errors.cost}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                    결제일 *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        className={`w-full pl-4 pr-10 py-2.5 rounded-xl border ${errors.billingDay
                                                ? 'border-red-400 dark:border-red-500'
                                                : 'border-gray-200 dark:border-dark-600'
                                            } bg-gray-50 dark:bg-dark-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all`}
                                        value={formData.billingDay}
                                        onChange={(e) => setFormData({ ...formData, billingDay: e.target.value })}
                                    />
                                    <span className="absolute right-3 top-2.5 text-gray-400 dark:text-dark-500 text-sm">일</span>
                                </div>
                                {errors.billingDay && (
                                    <p className="text-red-500 text-xs mt-1">{errors.billingDay}</p>
                                )}
                            </div>
                        </div>

                        {/* Billing cycle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                결제 주기
                            </label>
                            <div className="flex gap-2">
                                {Object.entries(BILLING_CYCLES).map(([key, { label }]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, billingCycle: key })}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${formData.billingCycle === key
                                                ? 'bg-primary-500 text-white shadow-md'
                                                : 'bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-dark-400 hover:bg-gray-200 dark:hover:bg-dark-600'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                웹사이트 링크 (선택)
                            </label>
                            <div className="relative">
                                <ExternalLink className="absolute left-3 top-2.5 text-gray-400 dark:text-dark-500" size={16} />
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 dark:text-dark-500 mt-1 pl-1">
                                입력시 리스트에서 바로가기 버튼이 생성됩니다.
                            </p>
                        </div>

                        {/* Trial end date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5 flex items-center gap-1">
                                무료 체험 종료일 (선택)
                                <HelpCircle size={12} className="text-gray-400" />
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 text-gray-400 dark:text-dark-500" size={16} />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                                    value={formData.trialEndDate}
                                    onChange={(e) => setFormData({ ...formData, trialEndDate: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                                카테고리
                            </label>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {Object.keys(CATEGORY_COLORS).map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat })}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${formData.category === cat
                                                ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900 shadow-md transform scale-105'
                                                : 'bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-dark-400 hover:bg-gray-200 dark:hover:bg-dark-600'
                                            }`}
                                    >
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                                        />
                                        {CATEGORY_LABELS[cat] || cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">
                                메모 (선택)
                            </label>
                            <textarea
                                placeholder="공유 계정, 요금제 등 메모..."
                                rows={2}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm resize-none"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-base transform active:scale-[0.98] transition-all shadow-lg shadow-primary-500/30 mt-2 flex items-center justify-center gap-2 btn-press"
                        >
                            <Check size={20} />
                            {editData ? '수정 완료' : '등록하기'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
