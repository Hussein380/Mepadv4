import { format, parseISO } from 'date-fns';

export const formatDate = (date) => {
    if (!date) return '';
    try {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date;
        return format(parsedDate, 'PPP');
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Invalid date';
    }
};

export const getErrorMessage = (error) => {
    return error.response?.data?.error?.message || 'Something went wrong';
};

export const getUserFromStorage = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}; 