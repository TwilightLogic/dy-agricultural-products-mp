function formatTime(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const formatNumber = (n) => {
    n = n.toString();
    return n[1] ? n : '0' + n;
  };

  return `${year}-${formatNumber(month)}-${formatNumber(day)} ${formatNumber(
    hour
  )}:${formatNumber(minute)}:${formatNumber(second)}`;
}

module.exports = {
  formatTime: formatTime,
};
