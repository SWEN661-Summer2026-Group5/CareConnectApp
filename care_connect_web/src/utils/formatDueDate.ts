// Formats a due date the same way the desktop / mobile apps do:
//   "Today at 9:00 AM" / "Tomorrow at 2:30 PM"
// Anything that is not the current calendar day is rendered as "Tomorrow".
export function formatDueDate(date: Date): string {
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const hours12 = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = date.getHours() < 12 ? 'AM' : 'PM';

  return `${isToday ? 'Today' : 'Tomorrow'} at ${hours12}:${minutes} ${ampm}`;
}
