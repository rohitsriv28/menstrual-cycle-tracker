import { useContext } from "react";
import { PeriodContext } from "../context/PeriodContext";
import { predictNextPeriod } from "../utils/calculateCycle";
import { calculateFertileWindow } from "../utils/calculateFertileWindow";

const CyclePrediction = () => {
  const { periodData, cycleLength } = useContext(PeriodContext);

  if (periodData.length === 0) {
    return <p className="text-center mt-10">No period data logged yet.</p>;
  }

  const lastPeriodDate = periodData[periodData.length - 1];
  const nextPeriod = predictNextPeriod(lastPeriodDate, cycleLength);
  const { fertileStart, ovulationDate } = calculateFertileWindow(
    lastPeriodDate,
    cycleLength
  );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Cycle Prediction</h2>
      <div className="space-y-2">
        <p>
          <strong>Last Period:</strong> {lastPeriodDate}
        </p>
        <p>
          <strong>Next Expected Period:</strong> {nextPeriod}
        </p>
        <p>
          <strong>Fertile Window:</strong> {fertileStart} to {ovulationDate}
        </p>
        <p>
          <strong>Cycle Length:</strong> {cycleLength} days
        </p>
      </div>
    </div>
  );
};

export default CyclePrediction;
