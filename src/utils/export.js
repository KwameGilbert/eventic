/**
 * Export Utility
 * Provides functions for exporting data to CSV and Excel formats
 */

/**
 * Convert array of objects to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {Array} columns - Array of column configuration {key: string, label: string}
 * @returns {string} CSV formatted string
 */
export const arrayToCSV = (data, columns) => {
    if (!data || data.length === 0) return '';

    // Create header row
    const headers = columns.map(col => `"${col.label}"`).join(',');

    // Create data rows
    const rows = data.map(item => {
        return columns.map(col => {
            const value = item[col.key] ?? '';
            // Escape quotes and wrap in quotes
            return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',');
    });

    return [headers, ...rows].join('\n');
};

/**
 * Download CSV file
 * @param {string} csvContent - CSV formatted string
 * @param {string} filename - Filename without extension
 */
export const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

/**
 * Export attendees data to CSV
 * @param {Array} attendees - Array of attendee objects
 * @param {string} filename - Optional custom filename
 */
export const exportAttendees = (attendees, filename = 'attendees-export') => {
    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'event', label: 'Event' },
        { key: 'ticket_type', label: 'Ticket Type' },
        { key: 'ticket_code', label: 'Ticket Code' },
        { key: 'order_reference', label: 'Order Reference' },
        { key: 'order_date', label: 'Order Date' },
        { key: 'checked_in', label: 'Checked In' },
        { key: 'check_in_time', label: 'Check-in Time' },
    ];

    const csv = arrayToCSV(attendees, columns);
    downloadCSV(csv, filename);
};

/**
 * Export finance data to CSV
 * @param {Array} data - Array of finance records (events or awards)
 * @param {string} type - 'events' or 'awards'
 * @param {string} filename - Optional custom filename
 */
export const exportFinanceReport = (data, type = 'events', filename) => {
    const defaultFilename = `${type}-revenue-${new Date().toISOString().split('T')[0]}`;

    let columns;
    if (type === 'events') {
        columns = [
            { key: 'event_name', label: 'Event Name' },
            { key: 'event_date', label: 'Event Date' },
            { key: 'status', label: 'Status' },
            { key: 'total_orders', label: 'Total Orders' },
            { key: 'tickets_sold', label: 'Tickets Sold' },
            { key: 'gross_revenue', label: 'Gross Revenue (GH₵)' },
            { key: 'platform_fee', label: 'Platform Fee (GH₵)' },
            { key: 'net_revenue', label: 'Net Revenue (GH₵)' },
            { key: 'payout_status', label: 'Payout Status' },
        ];
    } else {
        columns = [
            { key: 'award_title', label: 'Award Title' },
            { key: 'ceremony_date', label: 'Ceremony Date' },
            { key: 'status', label: 'Status' },
            { key: 'total_votes', label: 'Total Votes' },
            { key: 'total_voters', label: 'Total Voters' },
            { key: 'gross_revenue', label: 'Gross Revenue (GH₵)' },
            { key: 'platform_fee', label: 'Platform Fee (GH₵)' },
            { key: 'net_revenue', label: 'Net Revenue (GH₵)' },
            { key: 'payout_status', label: 'Payout Status' },
        ];
    }

    const csv = arrayToCSV(data, columns);
    downloadCSV(csv, filename || defaultFilename);
};

/**
 * Export combined finance summary
 * @param {Object} overview - Finance overview data
 * @param {Array} eventsData - Events revenue data
 * @param {Array} awardsData - Awards revenue data
 */
export const exportFinanceSummary = (overview, eventsData, awardsData) => {
    const filename = `finance-summary-${new Date().toISOString().split('T')[0]}`;

    // Create summary section
    const summary = overview?.summary || {};
    const summaryData = [
        ['Finance Summary Report', ''],
        ['Generated', new Date().toLocaleString()],
        ['', ''],
        ['Total Gross Revenue', `GH₵${summary.total_gross_revenue?.toFixed(2) || '0.00'}`],
        ['Total Platform Fees', `GH₵${summary.total_platform_fees?.toFixed(2) || '0.00'}`],
        ['Total Net Revenue', `GH₵${summary.total_net_revenue?.toFixed(2) || '0.00'}`],
        ['Available Balance', `GH₵${summary.available_balance?.toFixed(2) || '0.00'}`],
        ['Pending Balance', `GH₵${summary.pending_balance?.toFixed(2) || '0.00'}`],
        ['Completed Payouts', `GH₵${summary.completed_payouts?.toFixed(2) || '0.00'}`],
        ['', ''],
    ];

    // Add events section
    if (eventsData && eventsData.length > 0) {
        summaryData.push(['EVENTS REVENUE', '']);
        const eventsColumns = [
            { key: 'event_name', label: 'Event Name' },
            { key: 'gross_revenue', label: 'Gross (GH₵)' },
            { key: 'platform_fee', label: 'Fee (GH₵)' },
            { key: 'net_revenue', label: 'Net (GH₵)' },
        ];
        const eventsCSV = arrayToCSV(eventsData, eventsColumns);
        summaryData.push(...eventsCSV.split('\n').map(line => line.split(',')));
        summaryData.push(['', '']);
    }

    // Add awards section
    if (awardsData && awardsData.length > 0) {
        summaryData.push(['AWARDS REVENUE', '']);
        const awardsColumns = [
            { key: 'award_title', label: 'Award Title' },
            { key: 'gross_revenue', label: 'Gross (GH₵)' },
            { key: 'platform_fee', label: 'Fee (GH₵)' },
            { key: 'net_revenue', label: 'Net (GH₵)' },
        ];
        const awardsCSV = arrayToCSV(awardsData, awardsColumns);
        summaryData.push(...awardsCSV.split('\n').map(line => line.split(',')));
    }

    // Convert to CSV and download
    const csv = summaryData.map(row => row.join(',')).join('\n');
    downloadCSV(csv, filename);
};

export default {
    arrayToCSV,
    downloadCSV,
    exportAttendees,
    exportFinanceReport,
    exportFinanceSummary,
};
