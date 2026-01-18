import moment from 'moment';

/**
 * Formats a given date string into a human-readable format.
 * @param {string} dateString - The date string to format.
 * @param {string} formatType - The predefined format type or custom format.
 * @returns {string} - Formatted date.
 */
export const formatDate = (dateString, formatType = 'FULL_DATE') => {
    if (!dateString) return '-';

    const formats = {
        FULL_DATE: 'DD MMMM YYYY',     // 22 July 2024
        SHORT_DATE: 'DD/MM/YYYY',      // 22/07/2024
        US_DATE: 'MM-DD-YYYY',         // 07-22-2024
        ISO_DATE: 'YYYY-MM-DD',        // 2024-07-22
        TIME: 'HH:mm:ss',              // 14:30:00
        DATE_TIME: 'DD MMM YYYY, HH:mm', // 22 Jul 2024, 14:30
        SHORT_MONTH_DATE: 'DD MMM YYYY', // 22 Jul 2024
        DAY_MONTH: 'DD MMM',           // 22 Jul
        MONTH_YEAR: 'MMMM YYYY',       // July 2024
        YEAR_ONLY: 'YYYY',             // 2024
    };

    const format = formats[formatType] || formatType; // Use predefined or custom format
    return moment(dateString).format(format);
};
