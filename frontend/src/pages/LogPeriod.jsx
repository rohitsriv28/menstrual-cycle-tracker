import { useContext, useState } from "react";
import { PeriodContext } from "../context/PeriodContext";

const LogPeriod = () => {
  const { logPeriod, periodData } = useContext(PeriodContext);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flowIntensity, setFlowIntensity] = useState("medium");
  const [symptoms, setSymptoms] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const symptomOptions = [
    "Cramps",
    "Headache",
    "Bloating",
    "Fatigue",
    "Mood swings",
    "Backache",
    "Breast tenderness",
    "Nausea",
  ];

  const toggleSymptom = (symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter((s) => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const validateDates = () => {
    const selectedStartDate = new Date(startDate);
    const selectedEndDate = endDate ? new Date(endDate) : null;
    const today = new Date();

    if (!startDate) {
      setError("Please select a start date.");
      return false;
    }

    if (selectedStartDate > today) {
      setError("You cannot log a future start date.");
      return false;
    }

    if (periodData.some((period) => period.startDate === startDate)) {
      setError("This start date has already been logged.");
      return false;
    }

    if (endDate && selectedEndDate < selectedStartDate) {
      setError("End date cannot be before start date.");
      return false;
    }

    if (endDate && selectedEndDate > today) {
      setError("You cannot log a future end date.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateDates()) {
      return;
    }

    setIsSubmitting(true);

    // Create period data object
    const periodInfo = {
      startDate,
      endDate: endDate || "",
      flowIntensity,
      symptoms,
      duration: endDate
        ? (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1
        : null,
    };

    logPeriod(periodInfo);
    setStartDate("");
    setEndDate("");
    setFlowIntensity("medium");
    setSymptoms([]);
    setError("");

    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message
      const successElement = document.getElementById("success-message");
      successElement.classList.remove("opacity-0");
      setTimeout(() => {
        successElement.classList.add("opacity-0");
      }, 3000);
    }, 600);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-pink-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Log Your Period</h2>
      </div>

      <div
        id="success-message"
        className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg transition-opacity duration-500 opacity-0"
      >
        Period logged successfully!
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            When did your period start?
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            When did your period end? (optional)
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave blank if your period is still ongoing
          </p>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Flow Intensity
          </label>
          <div className="flex items-center space-x-2">
            {["light", "medium", "heavy"].map((intensity) => (
              <button
                key={intensity}
                type="button"
                onClick={() => setFlowIntensity(intensity)}
                className={`flex-1 py-2 px-4 rounded-lg transition capitalize ${
                  flowIntensity === intensity
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Symptoms (optional)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {symptomOptions.map((symptom) => (
              <div
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  symptoms.includes(symptom)
                    ? "border-pink-500 bg-pink-50 text-pink-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {symptom}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className={`bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition w-full flex justify-center items-center ${
            isSubmitting ? "opacity-75" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Log Period"
          )}
        </button>
      </form>
    </div>
  );
};

export default LogPeriod;
