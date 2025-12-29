import { useState, useRef } from 'react';
import {
    X,
    Moon,
    Sun,
    Download,
    Upload,
    Trash2,
    AlertTriangle,
    FileJson,
    FileText,
    Check
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { exportToCSV, exportToJSON, parseCSV, parseJSON, downloadFile, readFileAsText } from '../utils/exportData';

export default function SettingsPanel({
    isOpen,
    onClose,
    subscriptions,
    onImport,
    onClearAll
}) {
    const { isDark, toggleTheme } = useTheme();
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleExportCSV = () => {
        const csv = exportToCSV(subscriptions);
        const filename = `subscriptions_${new Date().toISOString().split('T')[0]}.csv`;
        downloadFile(csv, filename, 'text/csv;charset=utf-8');
    };

    const handleExportJSON = () => {
        const json = exportToJSON(subscriptions);
        const filename = `subscriptions_${new Date().toISOString().split('T')[0]}.json`;
        downloadFile(json, filename, 'application/json');
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const content = await readFileAsText(file);
            let parsedData = [];

            if (file.name.endsWith('.json')) {
                parsedData = parseJSON(content);
            } else if (file.name.endsWith('.csv')) {
                parsedData = parseCSV(content);
            }

            if (parsedData.length > 0) {
                const count = await onImport(parsedData);
                setImportResult({ success: true, count });
                setTimeout(() => setImportResult(null), 3000);
            } else {
                setImportResult({ success: false, message: '유효한 데이터가 없습니다' });
                setTimeout(() => setImportResult(null), 3000);
            }
        } catch (error) {
            console.error('Import error:', error);
            setImportResult({ success: false, message: '파일을 읽는 중 오류가 발생했습니다' });
            setTimeout(() => setImportResult(null), 3000);
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClearAll = async () => {
        await onClearAll();
        setShowConfirmClear(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-end md:items-center justify-center backdrop-blur-sm modal-backdrop">
            <div className="bg-white dark:bg-dark-800 w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden modal-content max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-dark-700 flex justify-between items-center bg-gray-50/50 dark:bg-dark-900/50 sticky top-0 z-10">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">설정</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Theme toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-800 dark:text-white text-sm">다크 모드</h4>
                            <p className="text-xs text-gray-500 dark:text-dark-400 mt-0.5">
                                어두운 테마로 전환합니다
                            </p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative w-14 h-7 rounded-full transition-colors ${isDark ? 'bg-primary-500' : 'bg-gray-200 dark:bg-dark-700'
                                }`}
                        >
                            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${isDark ? 'translate-x-7' : 'translate-x-0.5'
                                }`}>
                                {isDark ? <Moon size={12} className="text-primary-500" /> : <Sun size={12} className="text-amber-500" />}
                            </div>
                        </button>
                    </div>

                    <hr className="border-gray-100 dark:border-dark-700" />

                    {/* Export section */}
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-3">
                            데이터 내보내기
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleExportCSV}
                                disabled={subscriptions.length === 0}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FileText size={18} />
                                <span className="text-sm font-medium">CSV</span>
                            </button>
                            <button
                                onClick={handleExportJSON}
                                disabled={subscriptions.length === 0}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FileJson size={18} />
                                <span className="text-sm font-medium">JSON</span>
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-dark-500 mt-2">
                            {subscriptions.length}개의 구독 데이터를 내보냅니다
                        </p>
                    </div>

                    <hr className="border-gray-100 dark:border-dark-700" />

                    {/* Import section */}
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-3">
                            데이터 가져오기
                        </h4>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.json"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="import-file"
                        />
                        <label
                            htmlFor="import-file"
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700/50 text-gray-600 dark:text-dark-400 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors"
                        >
                            <Upload size={18} />
                            <span className="text-sm font-medium">CSV 또는 JSON 파일 선택</span>
                        </label>

                        {/* Import result message */}
                        {importResult && (
                            <div className={`mt-2 p-2 rounded-lg text-xs flex items-center gap-2 ${importResult.success
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                    : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                }`}>
                                {importResult.success ? <Check size={14} /> : <AlertTriangle size={14} />}
                                {importResult.success
                                    ? `${importResult.count}개의 구독을 가져왔습니다`
                                    : importResult.message
                                }
                            </div>
                        )}
                    </div>

                    <hr className="border-gray-100 dark:border-dark-700" />

                    {/* Clear all section */}
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-3">
                            위험 구역
                        </h4>

                        {!showConfirmClear ? (
                            <button
                                onClick={() => setShowConfirmClear(true)}
                                disabled={subscriptions.length === 0}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 size={18} />
                                <span className="text-sm font-medium">모든 데이터 삭제</span>
                            </button>
                        ) : (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-3">
                                    <AlertTriangle size={18} />
                                    <span className="font-medium text-sm">정말 삭제하시겠습니까?</span>
                                </div>
                                <p className="text-xs text-red-500 dark:text-red-400/80 mb-3">
                                    모든 구독 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowConfirmClear(false)}
                                        className="flex-1 py-2 px-4 rounded-lg bg-white dark:bg-dark-700 text-gray-600 dark:text-dark-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={handleClearAll}
                                        className="flex-1 py-2 px-4 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Version info */}
                    <div className="text-center pt-4">
                        <p className="text-[10px] text-gray-400 dark:text-dark-500">
                            구독 매니저 Pro v1.0.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
