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

  const logPeriod = (date) => {
    if (!date || isNaN(new Date(date))) {
      throw new Error("Invalid date");
    }
    setPeriodData([...periodData, date]);
  };

  const getNextPeriodDate = () => {
    if (periodData.length === 0) return null;
    const lastPeriodDate = periodData[periodData.length - 1];
    return predictNextPeriod(lastPeriodDate, cycleLength);
  };

  const getFertileWindow = () => {
    if (periodData.length === 0) return null;
    const lastPeriodDate = periodData[periodData.length - 1];
    return calculateFertileWindow(lastPeriodDate, cycleLength);
  };

  return (
    <PeriodContext.Provider
      value={{
        periodData,
        cycleLength,
        setCycleLength,
        logPeriod,
        getNextPeriodDate,
        getFertileWindow,
      }}
    >
      {children}
    </PeriodContext.Provider>
  );
};
