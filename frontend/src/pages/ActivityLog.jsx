import { useState } from "react";

const ActivityLog = () => {
  const [physicallyInvolved, setPhysicallyInvolved] = useState(false);
  const [timesInvolved, setTimesInvolved] = useState("");
  const [daysAgo, setDaysAgo] = useState("");
  const [protectionUsed, setProtectionUsed] = useState(false);

  const [selfPleasuring, setSelfPleasuring] = useState(false);
  const [selfPleasuringTimes, setSelfPleasuringTimes] = useState("");
  const [lastSelfPleasure, setLastSelfPleasure] = useState("");

  const [shareWithPartner, setShareWithPartner] = useState({
    physicallyInvolved: false,
    timesInvolved: false,
    daysAgo: false,
    protectionUsed: false,
    selfPleasuring: false,
    selfPleasuringTimes: false,
    lastSelfPleasure: false,
  });

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (physicallyInvolved && (timesInvolved <= 0 || daysAgo <= 0)) {
      setError(
        "Please enter valid numbers for 'How many times?' and 'How many days ago?'."
      );
      return;
    }
    if (selfPleasuring && (selfPleasuringTimes <= 0 || !lastSelfPleasure)) {
      setError(
        "Please enter valid numbers for 'How many times?' and a valid date for 'When was the last time?'."
      );
      return;
    }

    const logData = {
      physicallyInvolved,
      timesInvolved: physicallyInvolved ? timesInvolved : "N/A",
      daysAgo: physicallyInvolved ? daysAgo : "N/A",
      protectionUsed: physicallyInvolved
        ? protectionUsed
          ? "Yes"
          : "No"
        : "N/A",
      selfPleasuring,
      selfPleasuringTimes: selfPleasuring ? selfPleasuringTimes : "N/A",
      lastSelfPleasure: selfPleasuring ? lastSelfPleasure : "N/A",
      shareWithPartner,
    };

    alert("Activity Logged Successfully!");
    console.log("Activity Data:", logData);

    // Reset form after submission
    setPhysicallyInvolved(false);
    setTimesInvolved("");
    setDaysAgo("");
    setProtectionUsed(false);
    setSelfPleasuring(false);
    setSelfPleasuringTimes("");
    setLastSelfPleasure("");
    setError("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Log Activity</h2>
      <form onSubmit={handleSubmit}>
        {/* Physical Involvement */}
        <div className="mb-4">
          <label className="block mb-2">Were you physically involved?</label>
          <select
            value={physicallyInvolved}
            onChange={(e) => setPhysicallyInvolved(e.target.value === "true")}
            className="border p-2 w-full rounded"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        {physicallyInvolved && (
          <>
            <label className="block mb-2">How many times?</label>
            <input
              type="number"
              value={timesInvolved}
              onChange={(e) => setTimesInvolved(e.target.value)}
              className="border p-2 w-full rounded mb-4"
              placeholder="Enter number of times"
              min="1"
              required
            />

            <label className="block mb-2">How many days ago?</label>
            <input
              type="number"
              value={daysAgo}
              onChange={(e) => setDaysAgo(e.target.value)}
              className="border p-2 w-full rounded mb-4"
              placeholder="Enter days ago"
              min="1"
              required
            />

            <div className="mb-4">
              <label className="block mb-2">Used Protection?</label>
              <input
                type="checkbox"
                checked={protectionUsed}
                onChange={(e) => setProtectionUsed(e.target.checked)}
                className="mr-2"
              />
              <span>{protectionUsed ? "Yes" : "No"}</span>
            </div>
          </>
        )}

        {/* Self-Pleasuring Log */}
        <div className="mb-4">
          <label className="block mb-2">Did self-pleasuring?</label>
          <select
            value={selfPleasuring}
            onChange={(e) => setSelfPleasuring(e.target.value === "true")}
            className="border p-2 w-full rounded"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        {selfPleasuring && (
          <>
            <label className="block mb-2">How many times?</label>
            <input
              type="number"
              value={selfPleasuringTimes}
              onChange={(e) => setSelfPleasuringTimes(e.target.value)}
              className="border p-2 w-full rounded mb-4"
              placeholder="Enter number of times"
              min="1"
              required
            />

            <label className="block mb-2">When was the last time?</label>
            <input
              type="date"
              value={lastSelfPleasure}
              onChange={(e) => setLastSelfPleasure(e.target.value)}
              className="border p-2 w-full rounded mb-4"
              max={new Date().toISOString().split("T")[0]} // Prevent future dates
              required
            />
          </>
        )}

        {/* Partner Sharing Options */}
        <h3 className="text-lg font-bold mt-6 mb-2">Sharing Preferences</h3>
        <p className="text-sm text-gray-600 mb-2">
          Select what you want to share with your partner:
        </p>

        {Object.keys(shareWithPartner).map((key) => (
          <div key={key} className="mb-2">
            <input
              type="checkbox"
              checked={shareWithPartner[key]}
              onChange={() =>
                setShareWithPartner((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              className="mr-2"
            />
            <label className="capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
          </div>
        ))}

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <button className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 w-full mt-4">
          Log Activity
        </button>
      </form>
    </div>
  );
};

export default ActivityLog;
