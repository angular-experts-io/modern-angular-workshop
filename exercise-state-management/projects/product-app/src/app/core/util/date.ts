export function buildMonthNamesAndShortYear() {
  return Array.from(Array(24).fill(0), (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return (
      date.toLocaleString('default', { month: 'short' }) +
      ' ' +
      date.getFullYear().toString().slice(-2)
    );
  });
}
