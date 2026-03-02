/** Get array of day numbers for a calendar grid (null = empty cell before month starts) */
export const getCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const days = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) days.push(i);
  return days;
};

export const isWeekday = (year, month, day) => {
  const dayOfWeek = new Date(year, month, day).getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
};

export const isPastDate = (year, month, day) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month, day) < today;
};

export const isToday = (year, month, day) => {
  const today = new Date();
  return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
};
