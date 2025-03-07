import { useState } from "react";

const Symptoms = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [mood, setMood] = useState("");
  const availableSymptoms = [
    "Cramps",
    "Bloating",
    "Fatigue",
    "Headache",
    "Nausea",
  ];
  const availableMoods = ["Happy", "Irritable", "Anxious", "Sad", "Energetic"];

  const toggleSymptom = (symptom) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logged Symptoms: ${symptoms.join(", ")} | Mood: ${mood}`);
    setSymptoms([]);
    setMood("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Log Symptoms & Mood</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <p className="font-bold">Symptoms:</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {availableSymptoms.map((symptom) => (
              <button
                type="button"
                key={symptom}
                className={`p-2 rounded flex items-center justify-center ${
                  symptoms.includes(symptom)
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => toggleSymptom(symptom)}
              >
                {symptom}
                {symptoms.includes(symptom) && <span className="ml-2">✓</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <p className="font-bold">Mood:</p>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="border p-2 w-full rounded mt-2"
            required
          >
            <option value="">Select Mood</option>
            {availableMoods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <button className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 w-full">
          Log Symptoms
        </button>
      </form>
    </div>
  );
};

export default Symptoms;
