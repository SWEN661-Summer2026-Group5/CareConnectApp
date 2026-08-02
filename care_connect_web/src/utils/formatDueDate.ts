// Formats a due date the same way across the desktop, web, and mobile apps:
//   same calendar day     → "Today at 9:00 AM"
//   next calendar day     → "Tomorrow at 2:30 PM"
//   previous calendar day → "Yesterday at 11:00 PM"
//   anything else         → "Mon, Aug 3 at 10:00 AM"

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatDueDate(date: Date): string {
  const now = new Date();
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round(
    (startOfDay(date) - startOfDay(now)) / (24 * 3600 * 1000),
  );

  const hours12 = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = date.getHours() < 12 ? 'AM' : 'PM';
  const time = `${hours12}:${minutes} ${ampm}`;

  if (dayDiff === 0) return `Today at ${time}`;
  if (dayDiff === 1) return `Tomorrow at ${time}`;
  if (dayDiff === -1) return `Yesterday at ${time}`;
  return `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()} at ${time}`;
}
