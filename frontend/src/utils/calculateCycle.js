export const predictNextPeriod = (lastPeriodDate, cycleLength = 28) => {
  if (!lastPeriodDate || isNaN(new Date(lastPeriodDate))) {
    throw new Error("Invalid lastPeriodDate");
  }
  if (cycleLength <= 0) {
    throw new Error("Cycle length must be a positive number");
  }
  const lastDate = new Date(lastPeriodDate);
  const nextPeriodDate = new Date(lastDate);
  nextPeriodDate.setDate(lastDate.getDate() + cycleLength);
  return nextPeriodDate.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
};
