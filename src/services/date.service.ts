export function getToday(): number {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return today.getTime();
}

export function resetTime(diMs: number): number {
    const date = new Date(diMs);
    date.setUTCHours(0, 0, 0, 0);
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
export function getMonth(diMs: number): string {
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
    const date = new Date(diMs);
    return month[date.getMonth()];
}
export function getShortDate(diMs: number): string {
    const date = new Date(diMs);
    return `${date.getDate() + 1} / ${date.getMonth()}`;
}

export function isUpcomingDate(diMs: number, days: number): boolean {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setUTCHours(0, 0, 0, 0);

    const dueDate = new Date(diMs);
    dueDate.setUTCHours(0, 0, 0, 0);

    return dueDate <= date && dueDate >= today;
}

export function isPastDate(diMs: number): boolean {
    return resetTime(diMs) < getToday();
}

export function isToday(diMs: number): boolean {
    return resetTime(diMs) === getToday();
}
