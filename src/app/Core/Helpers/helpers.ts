export function formatMessageDate(utcDate: string | Date): string {
  const messageDate = new Date(utcDate);
  const now = new Date();

  const isToday =
    messageDate.getFullYear() === now.getFullYear() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getDate() === now.getDate();

  if (isToday) {
    return messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  return messageDate.toLocaleDateString([], {
    day: '2-digit',
    month: 'short',
    year: messageDate.getFullYear() !== now.getFullYear()
      ? 'numeric'
      : undefined
  });
}