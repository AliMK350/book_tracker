export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR');
};

export const formatProgress = (pagesRead, totalPages) => {
  if (!totalPages) return '0%';
  return Math.round((pagesRead / totalPages) * 100) + '%';
};

export const formatReadingTime = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  return `${days} jours`;
};
