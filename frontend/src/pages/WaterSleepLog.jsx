import { useState } from "react";

const WaterSleepLog = () => {
  const [water, setWater] = useState("");
  const [sleep, setSleep] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!water || !sleep) {
      setError("Please fill in all fields.");
      return;
    }
    if (parseFloat(water) <= 0 || parseFloat(sleep) <= 0) {
      setError("Values must be greater than 0.");
      return;
    }

    alert(`Water Intake: ${water} L\nSleep: ${sleep} hours`);
    setWater("");
    setSleep("");
    setError("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Log Water & Sleep</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Water Intake (L):</label>
        <input
          type="number"
          value={water}
          onChange={(e) => setWater(e.target.value)}
          className="border p-2 w-full rounded mb-2"
          placeholder="Enter liters"
          required
          min="0"
          step="0.1"
        />

        <label className="block mb-2">Sleep (Hours):</label>
        <input
          type="number"
          value={sleep}
          onChange={(e) => setSleep(e.target.value)}
          className="border p-2 w-full rounded mb-2"
          placeholder="Enter hours"
          required
          min="0"
          step="0.1"
        />

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <button className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 w-full">
          Log Data
        </button>
      </form>
    </div>
  );
};

export default WaterSleepLog;
