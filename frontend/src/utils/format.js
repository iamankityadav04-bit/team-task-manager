import { format, isPast, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return 'No date';
  return format(new Date(date), 'dd MMM yyyy');
};

export const isOverdue = (task) => {
  return task?.status !== 'COMPLETED' && task?.dueDate && isPast(parseISO(task.dueDate));
};

export const initials = (name = '') => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

export const apiErrorMessage = (error) => {
  return error.response?.data?.errors?.[0] || error.response?.data?.message || error.message || 'Request failed';
};
