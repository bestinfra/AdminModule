// Date utility functions for backend usage

// Returns current date in YYYY-MM-DD format
export function getDateInYMDFormat(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Returns current date and time in YYYY-MM-DD HH:mm:ss format
export function getDateTime(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Adds days to current date and returns YYYY-MM-DD
export function getBillPayDate(daysToAdd = 5) {
    const currentDate = new Date();
    const millisecondsToAdd = daysToAdd * 24 * 60 * 60 * 1000;
    const billPayDate = new Date(currentDate.getTime() + millisecondsToAdd);
    return getDateInYMDFormat(billPayDate);
}

// Formats a date as DD-MM-YYYY
export function formatDateDMY(date = new Date()) {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Generates an invoice number with date and time
export function generateInvoiceNumber() {
    const prefix = 'INV';
    const now = new Date();
    const isoString = now.toISOString();
    const datePart = isoString.slice(0, 10).replace(/-/g, '');
    const timePart = isoString.slice(11, 19).replace(/:/g, '');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${datePart.substring(2)}${timePart}${randomPart}`;
} 

// Returns date in MM-YYYY format
export function getDateInMYFormat(date = new Date()) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${year}`;
}

// Fills missing dates in data for charts
export function fillMissingDatesDyno(dates, values, format = 'DD MMM, YYYY', type = 'day') {
    if (!dates || !values || dates.length === 0) {
        return { dates: [], values: [] };
    }

    const result = { dates: [], values: [] };
    
    // For now, return the original data
    // This function can be enhanced later for proper date filling
    result.dates = dates;
    result.values = values;
    
    return result;
} 