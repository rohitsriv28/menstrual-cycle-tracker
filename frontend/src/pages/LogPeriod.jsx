import { useContext, useState } from "react";
import { PeriodContext } from "../context/PeriodContext";

const LogPeriod = () => {
  const { logPeriod, periodData } = useContext(PeriodContext);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDate = new Date(date);
    const today = new Date();

    if (!date) {
      setError("Please select a date.");
      return;
    }
    if (selectedDate > today) {
      setError("You cannot log a future date.");
      return;
    }
    if (periodData.includes(date)) {
      setError("This date has already been logged.");
      return;
    }

    logPeriod(date);
    setDate("");
    setError("");
    alert("Period logged successfully!");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Log Your Period</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full rounded mb-2"
          required
        />
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <button className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 w-full">
          Log Period
        </button>
      </form>
    </div>
  );
};

export default LogPeriod;
