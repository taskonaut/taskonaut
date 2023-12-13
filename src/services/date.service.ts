/**
 * Retrieves the timestamp in milliseconds for the start of the specified date or the current date.
 *
 * If a date string in "YYYY-MM-DD" format is provided, it creates a Date object for that date.
 * Otherwise, it defaults to the current date.
 * The time portion of the date is set to midnight (00:00:00.000).
 *
 * @param {string} [dateString] - An optional date string in "YYYY-MM-DD" format.
 * @returns {number} The timestamp in milliseconds representing the start of the specified date or the current date.
 *
 * @example
 * // Current date
 * const currentTimestamp = getToday();
 *
 * // Custom date
 * const customTimestamp = getToday("2023-11-24");
 */
export function getTimestamp(dateString?: string): number {
    let today;
    if (dateString) {
        today = new Date(dateString);
    } else {
        today = new Date();
    }
    today.setHours(0, 0, 0, 0);
    return today.getTime();
}

/**
 * Converts a timestamp in milliseconds to a local date string in "YYYY-MM-DD" format.
 *
 * @param {number} timestampInMs - The timestamp in milliseconds.
 * @returns {string} The local date string in "YYYY-MM-DD" format.
 *
 * @example
 * const timestamp = Date.now(); // Current timestamp
 * const dateString = formatLocalDate(timestamp);
 * console.log(dateString); // Output: "2023-11-24" (example date)
 */
export function getLocalDate(timestampInMs: number): string {
    const dateObject = new Date(timestampInMs);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function resetTime(diMs: number): number {
    const date = new Date(diMs);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
}

export function getWeekDay(diMs: number): string {
    const weekday = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    const date = new Date(diMs);
    return weekday[date.getDay()];
}
export function getMonth(diMs: number, short: boolean = false): string {
    const month = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const monthShort = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const date = new Date(diMs);
    return short ? monthShort[date.getMonth()] : month[date.getMonth()];
}
export function getShortDate(diMs: number): string {
    const date = new Date(diMs);
    return `${date.getDate()} ${getMonth(diMs, true)}`;
}

export function isUpcomingDate(diMs: number, days: number): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(0, 0, 0, 0);

    const dueDate = new Date(diMs);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate <= date && dueDate >= today;
}

export function isPastDate(diMs: number): boolean {
    return resetTime(diMs) < getTimestamp();
}
export function daysPass(diMs: number): number {
    return Math.ceil((getTimestamp() - diMs) / (1000 * 3600 * 24));
}
export function isToday(diMs: number): boolean {
    return resetTime(diMs) == getTimestamp();
}
