/**
 * Data export/import utilities
 */

import { CATEGORY_COLORS } from './constants';

/**
 * Export subscriptions to CSV format
 * @param {Array} subscriptions - Array of subscription objects
 * @returns {string} CSV formatted string
 */
export const exportToCSV = (subscriptions) => {
    const headers = [
        '서비스명',
        '월 결제금액',
        '결제일',
        '카테고리',
        '결제주기',
        'URL',
        '일시정지',
        '메모',
        '생성일'
    ];

    const rows = subscriptions.map(sub => [
        sub.name,
        sub.cost,
        sub.billingDay,
        sub.category,
        sub.billingCycle || 'monthly',
        sub.url || '',
        sub.isPaused ? '예' : '아니오',
        sub.notes || '',
        sub.createdAt?.toDate?.()?.toISOString() || ''
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row =>
            row.map(cell =>
                typeof cell === 'string' && cell.includes(',')
                    ? `"${cell}"`
                    : cell
            ).join(',')
        )
    ].join('\n');

    return csvContent;
};

/**
 * Export subscriptions to JSON format
 * @param {Array} subscriptions - Array of subscription objects
 * @returns {string} JSON formatted string
 */
export const exportToJSON = (subscriptions) => {
    const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        subscriptions: subscriptions.map(sub => ({
            name: sub.name,
            cost: sub.cost,
            billingDay: sub.billingDay,
            category: sub.category,
            billingCycle: sub.billingCycle || 'monthly',
            url: sub.url || '',
            customColor: sub.customColor || '',
            isPaused: sub.isPaused || false,
            notes: sub.notes || '',
        }))
    };

    return JSON.stringify(exportData, null, 2);
};

/**
 * Parse CSV data to subscription objects
 * @param {string} csvString - CSV formatted string
 * @returns {Array} Array of subscription objects
 */
export const parseCSV = (csvString) => {
    const lines = csvString.trim().split('\n');
    if (lines.length < 2) return [];

    const subscriptions = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);

        if (values.length >= 4) {
            subscriptions.push({
                name: values[0]?.trim() || '',
                cost: parseInt(values[1]) || 0,
                billingDay: parseInt(values[2]) || 1,
                category: values[3]?.trim() || 'Etc',
                billingCycle: values[4]?.trim() || 'monthly',
                url: values[5]?.trim() || '',
                isPaused: values[6]?.trim() === '예',
                notes: values[7]?.trim() || '',
            });
        }
    }

    return subscriptions;
};

/**
 * Parse a single CSV line handling quoted values
 * @param {string} line - Single CSV line
 * @returns {Array} Array of values
 */
const parseCSVLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);

    return values;
};

/**
 * Parse JSON data to subscription objects
 * @param {string} jsonString - JSON formatted string
 * @returns {Array} Array of subscription objects
 */
export const parseJSON = (jsonString) => {
    try {
        const data = JSON.parse(jsonString);

        if (data.subscriptions && Array.isArray(data.subscriptions)) {
            return data.subscriptions.map(sub => ({
                name: sub.name || '',
                cost: parseInt(sub.cost) || 0,
                billingDay: parseInt(sub.billingDay) || 1,
                category: sub.category || 'Etc',
                billingCycle: sub.billingCycle || 'monthly',
                url: sub.url || '',
                customColor: sub.customColor || '',
                isPaused: sub.isPaused || false,
                notes: sub.notes || '',
            }));
        }

        return [];
    } catch (error) {
        console.error('JSON parsing error:', error);
        return [];
    }
};

/**
 * Download data as a file
 * @param {string} data - Data to download
 * @param {string} filename - Name of the file
 * @param {string} type - MIME type
 */
export const downloadFile = (data, filename, type) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Read file as text
 * @param {File} file - File to read
 * @returns {Promise<string>} File content as string
 */
export const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
};

/**
 * Validate subscription data
 * @param {Object} sub - Subscription object
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validateSubscription = (sub) => {
    const errors = [];

    if (!sub.name || sub.name.trim() === '') {
        errors.push('서비스명은 필수입니다');
    }

    if (!sub.cost || sub.cost < 0) {
        errors.push('결제금액은 0 이상이어야 합니다');
    }

    if (!sub.billingDay || sub.billingDay < 1 || sub.billingDay > 31) {
        errors.push('결제일은 1~31 사이여야 합니다');
    }

    if (!Object.keys(CATEGORY_COLORS).includes(sub.category)) {
        errors.push('유효하지 않은 카테고리입니다');
    }

    if (sub.url && !isValidUrl(sub.url)) {
        errors.push('유효하지 않은 URL입니다');
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Check if a string is a valid URL
 * @param {string} string - String to check
 * @returns {boolean} True if valid URL
 */
const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};
