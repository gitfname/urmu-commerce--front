import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

interface JalaliDate {
    day: string;
    month: string;
    year: string;
}

export function convertIsoToJalali(isoString: string): JalaliDate {
    try {
        // Create a DateObject from the ISO string
        const date = new DateObject({
            date: isoString,
            calendar: persian,
            locale: persian_fa,
        });

        // Check if the date is valid
        if (!date.isValid) {
            throw new Error('Invalid ISO date string');
        }

        // Extract day, month, and year
        const day = date.day.toString().padStart(2, '0'); // Day with leading zero (e.g., '04')
        const month = date.month.name; // Month name in Persian (e.g., 'فروردین')
        const year = date.year.toString(); // Year (e.g., '1404')

        return {
            day,
            month,
            year,
        };
    } catch (error) {
        throw new Error(`Failed to convert ISO string to Jalali date: ${error.message}`);
    }
}

// Example usage:
// try {
//     const isoDate = '2025-07-09T20:12:00.722Z';
//     const jalaliResult = convertIsoToJalali(isoDate);
//     console.log(jalaliResult); // Example output: { day: '18', month: 'تیر', year: '1404' }
// } catch (error) {
//     console.error(error.message);
// }