export function getToday(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
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
    return resetTime(diMs) < getToday();
}
export function daysPass(diMs: number): number {
    return Math.ceil((getToday() - diMs) / (1000 * 3600 * 24));
}
export function isToday(diMs: number): boolean {
    return resetTime(diMs) == getToday();
}
