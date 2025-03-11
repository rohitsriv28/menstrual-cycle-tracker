import { createContext, useEffect, useState } from "react";
import { predictNextPeriod } from "../utils/calculateCycle";
import { calculateFertileWindow } from "../utils/calculateFertileWindow";

export const PeriodContext = createContext();

export const PeriodProvider = ({ children }) => {
  // Load periodData and cycleLength from localStorage if available
  const [periodData, setPeriodData] = useState(
    JSON.parse(localStorage.getItem("periodData")) || []
  );
  const [cycleLength, setCycleLength] = useState(
    parseInt(localStorage.getItem("cycleLength"), 10) || 28
  );

  // Save periodData and cycleLength to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("periodData", JSON.stringify(periodData));
  }, [periodData]);

  useEffect(() => {
    localStorage.setItem("cycleLength", cycleLength.toString());
  }, [cycleLength]);

  // Updated to match the structure used in LogPeriod.jsx
  const logPeriod = (periodInfo) => {
    // Validate the period info object
    if (
      !periodInfo ||
      !periodInfo.startDate ||
      isNaN(new Date(periodInfo.startDate))
    ) {
      throw new Error("Invalid period information");
    }

    // Add the new period data to the array
    setPeriodData([...periodData, periodInfo]);
  };

  const getNextPeriodDate = () => {
    if (periodData.length === 0) return null;

    // Get the most recent period data
    const lastPeriod = periodData[periodData.length - 1];

    // Base prediction on end date if available, otherwise use start date
    const predictionBaseDate = lastPeriod.endDate
      ? new Date(lastPeriod.endDate)
      : new Date(lastPeriod.startDate);

    return predictNextPeriod(
      predictionBaseDate.toISOString().split("T")[0],
      cycleLength
    );
  };

  const getFertileWindow = () => {
    if (periodData.length === 0) return null;

    // Get the most recent period
    const lastPeriod = periodData[periodData.length - 1];

    return calculateFertileWindow(lastPeriod.startDate, cycleLength);
  };

  // Function to delete a period entry
  const deletePeriod = (startDate) => {
    setPeriodData(
      periodData.filter((period) => period.startDate !== startDate)
    );
  };

  // Function to update cycle length
  const updateCycleLength = (newLength) => {
    if (newLength >= 21 && newLength <= 35) {
      setCycleLength(newLength);
    } else {
      throw new Error("Cycle length must be between 21 and 35 days");
    }
  };

  // Function to update an existing period entry
  const updatePeriod = (startDate, updatedInfo) => {
    setPeriodData(
      periodData.map((period) =>
        period.startDate === startDate ? { ...period, ...updatedInfo } : period
      )
    );
  };

  // Get the current cycle phase
  const getCurrentPhase = () => {
    if (periodData.length === 0) return "Unknown";

    const today = new Date().toISOString().split("T")[0];
    const lastPeriod = periodData[periodData.length - 1];
    const nextPeriodDate = getNextPeriodDate();
    const { fertileStart, fertileEnd, ovulationDate } =
      getFertileWindow() || {};

    // Calculate days until next period
    const daysUntilNextPeriod = Math.ceil(
      (new Date(nextPeriodDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    if (
      today >= lastPeriod.startDate &&
      (lastPeriod.endDate
        ? today <= lastPeriod.endDate
        : daysUntilNextPeriod > cycleLength - 5)
    ) {
      return "Menstruation";
    } else if (today >= fertileStart && today <= fertileEnd) {
      return "Fertile Window";
    } else if (today === ovulationDate) {
      return "Ovulation Day";
    } else if (
      today > (lastPeriod.endDate || lastPeriod.startDate) &&
      today < fertileStart
    ) {
      return "Follicular Phase";
    } else {
      return "Luteal Phase";
    }
  };

  return (
    <PeriodContext.Provider
      value={{
        periodData,
        cycleLength,
        logPeriod,
        getNextPeriodDate,
        getFertileWindow,
        deletePeriod,
        updateCycleLength,
        updatePeriod,
        getCurrentPhase,
      }}
    >
      {children}
    </PeriodContext.Provider>
  );
};
