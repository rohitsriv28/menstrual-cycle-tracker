import { useContext, useState } from "react";
import { PeriodContext } from "../context/PeriodContext";
import { predictNextPeriod } from "../utils/calculateCycle";
import { calculateFertileWindow } from "../utils/calculateFertileWindow";

const CyclePrediction = () => {
  const { periodData, cycleLength } = useContext(PeriodContext);
  const [showDetailsFor, setShowDetailsFor] = useState(null);

  if (periodData.length === 0) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-pink-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No Period Data Yet</h3>
        <p className="text-gray-600">
          Log your period to see predictions and insights about your cycle.
        </p>
      </div>
    );
  }

  // Get the most recent period data
  const lastPeriod = periodData[periodData.length - 1];
  const lastStartDate = new Date(lastPeriod.startDate);

  // Base next period prediction on end date if available, otherwise use start date
  const predictionBaseDate = lastPeriod.endDate
    ? new Date(lastPeriod.endDate)
    : lastStartDate;
  const nextPeriod = predictNextPeriod(
    predictionBaseDate.toISOString().split("T")[0],
    cycleLength
  );

  const { fertileStart, fertileEnd, ovulationDate } = calculateFertileWindow(
    lastPeriod.startDate,
    cycleLength
  );

  // Format dates for display
  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days until next period
  const today = new Date();
  const nextPeriodDate = new Date(nextPeriod);
  const daysUntilNextPeriod = Math.ceil(
    (nextPeriodDate - today) / (1000 * 60 * 60 * 24)
  );

  // Calculate cycle phases
  const currentDate = today.toISOString().split("T")[0];
  let currentPhase = "";
  let phaseColor = "";

  if (
    currentDate >= lastPeriod.startDate &&
    (lastPeriod.endDate
      ? currentDate <= lastPeriod.endDate
      : daysUntilNextPeriod > cycleLength - 5)
  ) {
    currentPhase = "Menstruation";
    phaseColor = "bg-red-500";
  } else if (currentDate >= fertileStart && currentDate <= fertileEnd) {
    currentPhase = "Fertile Window";
    phaseColor = "bg-green-500";
  } else if (currentDate === ovulationDate) {
    currentPhase = "Ovulation Day";
    phaseColor = "bg-purple-500";
  } else if (
    currentDate > (lastPeriod.endDate || lastPeriod.startDate) &&
    currentDate < fertileStart
  ) {
    currentPhase = "Follicular Phase";
    phaseColor = "bg-blue-500";
  } else {
    currentPhase = "Luteal Phase";
    phaseColor = "bg-yellow-500";
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Cycle Insights</h2>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${phaseColor} mr-2`}></div>
            <p className="text-white text-opacity-90">
              Currently in:{" "}
              <span className="font-semibold">{currentPhase}</span>
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          {/* Next period countdown */}
          <div className="bg-pink-50 rounded-lg p-4 mb-6 flex items-center">
            <div className="bg-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 font-bold">
              {daysUntilNextPeriod}
            </div>
            <div>
              <p className="text-gray-700">Days until next period</p>
              <p className="text-sm text-gray-500">
                Expected on {formatDate(nextPeriod)}
              </p>
            </div>
          </div>

          {/* Cycle information */}
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">Recent Period</h3>
                  <p className="text-gray-600">
                    {formatDate(lastPeriod.startDate)}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setShowDetailsFor(
                      showDetailsFor === "lastPeriod" ? null : "lastPeriod"
                    )
                  }
                  className="text-pink-500 hover:text-pink-600 text-sm font-medium"
                >
                  {showDetailsFor === "lastPeriod"
                    ? "Hide details"
                    : "Show details"}
                </button>
              </div>

              {showDetailsFor === "lastPeriod" && (
                <div className="mt-3 pl-3 border-l-2 border-pink-200 text-sm space-y-1">
                  <p>
                    <span className="text-gray-500">Start date:</span>{" "}
                    {formatDate(lastPeriod.startDate)}
                  </p>
                  {lastPeriod.endDate && (
                    <>
                      <p>
                        <span className="text-gray-500">End date:</span>{" "}
                        {formatDate(lastPeriod.endDate)}
                      </p>
                      <p>
                        <span className="text-gray-500">Duration:</span>{" "}
                        {lastPeriod.duration} days
                      </p>
                    </>
                  )}
                  <p>
                    <span className="text-gray-500">Flow:</span>{" "}
                    {lastPeriod.flowIntensity}
                  </p>
                  {lastPeriod.symptoms && lastPeriod.symptoms.length > 0 && (
                    <p>
                      <span className="text-gray-500">Symptoms:</span>{" "}
                      {lastPeriod.symptoms.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="border-b border-gray-100 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">Next Period</h3>
                  <p className="text-gray-600">{formatDate(nextPeriod)}</p>
                </div>
                <div className="text-sm font-medium text-gray-500">
                  In {daysUntilNextPeriod} days
                </div>
              </div>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">Fertile Window</h3>
                  <p className="text-gray-600">
                    {formatDate(fertileStart)} - {formatDate(fertileEnd)}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setShowDetailsFor(
                      showDetailsFor === "fertilePeriod"
                        ? null
                        : "fertilePeriod"
                    )
                  }
                  className="text-pink-500 hover:text-pink-600 text-sm font-medium"
                >
                  {showDetailsFor === "fertilePeriod"
                    ? "Hide details"
                    : "Show details"}
                </button>
              </div>

              {showDetailsFor === "fertilePeriod" && (
                <div className="mt-3 pl-3 border-l-2 border-pink-200 text-sm space-y-1">
                  <p>
                    <span className="text-gray-500">Fertile window:</span>{" "}
                    {formatDate(fertileStart)} - {formatDate(fertileEnd)}
                  </p>
                  <p>
                    <span className="text-gray-500">Ovulation day:</span>{" "}
                    {formatDate(ovulationDate)}
                  </p>
                  <p className="text-xs text-gray-500 italic mt-1">
                    This is when you're most likely to get pregnant if you have
                    unprotected sex
                  </p>
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">Cycle Length</h3>
                  <p className="text-gray-600">{cycleLength} days</p>
                </div>
                <button className="text-pink-500 hover:text-pink-600 text-sm font-medium">
                  Adjust
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cycle visualization */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Cycle Phases</h3>
        <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
          {/* Cycle phase visualization */}
          <div
            className="absolute top-0 left-0 h-full bg-red-400"
            style={{
              width: `${(Math.min(5, cycleLength) / cycleLength) * 100}%`,
            }}
          ></div>
          <div
            className="absolute top-0 h-full bg-blue-400"
            style={{
              left: `${(Math.min(5, cycleLength) / cycleLength) * 100}%`,
              width: `${
                ((Math.min(fertileStart - lastPeriod.startDate, 9) - 5) /
                  cycleLength) *
                100
              }%`,
            }}
          ></div>
          <div
            className="absolute top-0 h-full bg-green-400"
            style={{
              left: `${
                ((fertileStart - lastPeriod.startDate) / cycleLength) * 100
              }%`,
              width: `${((fertileEnd - fertileStart) / cycleLength) * 100}%`,
            }}
          ></div>
          <div
            className="absolute top-0 h-full bg-yellow-400"
            style={{
              left: `${
                ((fertileEnd - lastPeriod.startDate + 1) / cycleLength) * 100
              }%`,
              width: `${
                ((cycleLength - (fertileEnd - lastPeriod.startDate + 1)) /
                  cycleLength) *
                100
              }%`,
            }}
          ></div>

          {/* Today marker */}
          <div
            className="absolute top-0 h-full w-1 bg-white"
            style={{
              left: `${Math.min(
                Math.max(
                  0,
                  ((today - lastStartDate) /
                    (1000 * 60 * 60 * 24) /
                    cycleLength) *
                    100
                ),
                100
              )}%`,
              boxShadow: "0 0 4px rgba(0,0,0,0.3)",
            }}
          ></div>
        </div>

        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-400 mr-1"></div>
            <span>Period</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
            <span>Follicular</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-400 mr-1"></div>
            <span>Fertile</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></div>
            <span>Luteal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyclePrediction;
