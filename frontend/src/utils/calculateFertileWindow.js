export const calculateFertileWindow = (lastPeriodDate, cycleLength = 28) => {
  if (!lastPeriodDate || isNaN(new Date(lastPeriodDate))) {
    throw new Error("Invalid lastPeriodDate");
  }
  if (cycleLength <= 0) {
    throw new Error("Cycle length must be a positive number");
  }
  const lastDate = new Date(lastPeriodDate);

  // Ovulation usually occurs ~14 days before next period
  const ovulationDate = new Date(lastDate);
  ovulationDate.setDate(lastDate.getDate() + (cycleLength - 14));
  // Fertile window: 5 days before ovulation + ovulation day
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(ovulationDate.getDate() - 5);
  const fertileEnd = new Date(ovulationDate); // Ovulation day is included
  return {
    fertileStart: fertileStart.toISOString().split("T")[0],
    fertileEnd: fertileEnd.toISOString().split("T")[0],
    ovulationDate: ovulationDate.toISOString().split("T")[0],
  };
};
