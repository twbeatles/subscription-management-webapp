/**
 * Date utility functions for subscription management
 */

/**
 * Calculate days left until the next billing date
 * @param {number} billingDay - Day of month (1-31)
 * @returns {number} Days until next billing
 */
export const calculateDaysLeft = (billingDay) => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let nextBillingDate = new Date(currentYear, currentMonth, billingDay);

    // If billing day has passed this month, move to next month
    if (currentDay > billingDay) {
        nextBillingDate = new Date(currentYear, currentMonth + 1, billingDay);
    }

    // Handle months with fewer days
    while (nextBillingDate.getDate() !== billingDay) {
        nextBillingDate.setDate(nextBillingDate.getDate() - 1);
    }

    if (currentDay === billingDay) return 0;

    const diffTime = nextBillingDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get the next billing date
 * @param {number} billingDay - Day of month (1-31)
 * @returns {Date} Next billing date
 */
export const getNextBillingDate = (billingDay) => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let nextBillingDate = new Date(currentYear, currentMonth, billingDay);

    if (currentDay >= billingDay) {
        nextBillingDate = new Date(currentYear, currentMonth + 1, billingDay);
    }

    return nextBillingDate;
};

/**
 * Format a date to Korean locale string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};

/**
 * Format a date to short format (MM/DD)
 * @param {Date} date - Date to format
 * @returns {string} Short formatted date string
 */
export const formatDateShort = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
};

/**
 * Get the current month name in Korean
 * @returns {string} Current month name
 */
export const getCurrentMonthName = () => {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'];
    return months[new Date().getMonth()];
};

/**
 * Get the current year
 * @returns {number} Current year
 */
export const getCurrentYear = () => {
    return new Date().getFullYear();
};

/**
 * Calculate if a trial is ending soon (within 7 days)
 * @param {Date|string} trialEndDate - Trial end date
 * @returns {boolean} True if trial is ending soon
 */
export const isTrialEndingSoon = (trialEndDate) => {
    if (!trialEndDate) return false;

    const endDate = new Date(trialEndDate);
    const today = new Date();
    const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= 7;
};

/**
 * Get days until trial ends
 * @param {Date|string} trialEndDate - Trial end date
 * @returns {number} Days until trial ends (-1 if expired)
 */
export const getDaysUntilTrialEnd = (trialEndDate) => {
    if (!trialEndDate) return -1;

    const endDate = new Date(trialEndDate);
    const today = new Date();
    const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    return diffDays;
};

/**
 * Get months between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} Array of month objects {year, month, name}
 */
export const getMonthsBetween = (startDate, endDate) => {
    const months = [];
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'];

    let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (current <= end) {
        months.push({
            year: current.getFullYear(),
            month: current.getMonth(),
            name: monthNames[current.getMonth()],
        });
        current.setMonth(current.getMonth() + 1);
    }

    return months;
};
