import { formatRelative, subDays } from 'date-fns';

/**
 * Formats a timestamp into pretty/relative time.
 * @param {string} timestamp - The timestamp to format.
 * @returns {string} - The formatted pretty/relative time.
 */
function formatRelativeTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    return formatRelative(date, now);
}

export { formatRelativeTime };
