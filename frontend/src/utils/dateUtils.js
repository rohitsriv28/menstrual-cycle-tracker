export const formatDate = (date) => {
  if (!date || isNaN(new Date(date))) {
    throw new Error("Invalid date");
  }
  return new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD
};

export const getDaysBetweenDates = (startDate, endDate) => {
  if (
    !startDate ||
    !endDate ||
    isNaN(new Date(startDate)) ||
    isNaN(new Date(endDate))
  ) {
    throw new Error("Invalid startDate or endDate");
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.floor((end - start) / (1000 * 60 * 60 * 24)); // Convert ms to days
};
