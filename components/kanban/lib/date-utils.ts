export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const target = new Date(date);

  const nowDay = now.getFullYear() * 365 + now.getMonth() * 30 + now.getDate();
  const targetDay = target.getFullYear() * 365 + target.getMonth() * 30 + target.getDate();
  const diff = targetDay - nowDay;

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 0) return `${formatShortDate(date)} · overdue`;

  return formatShortDate(date);
}

export function formatShortDate(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

export function isOverdue(date: Date): boolean {
  const now = new Date();
  const target = new Date(date);
  const nowDay = now.getFullYear() * 365 + now.getMonth() * 30 + now.getDate();
  const targetDay = target.getFullYear() * 365 + target.getMonth() * 30 + target.getDate();
  return targetDay < nowDay;
}

export function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}
