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
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

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

    console.log("Activity Data:", logData);
    setSuccess(true);

    // Reset form after submission
    setTimeout(() => {
      setPhysicallyInvolved(false);
      setTimesInvolved("");
      setDaysAgo("");
      setProtectionUsed(false);
      setSelfPleasuring(false);
      setSelfPleasuringTimes("");
      setLastSelfPleasure("");
      setSuccess(false);
    }, 2000);
  };

  // Helper function to format labels
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-pink-600 text-center">
        Intimate Activity Log
      </h2>

      {success && (
        <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Activity logged successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Physical Involvement Section */}
        <div className="bg-pink-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-pink-700">
            Partner Activity
          </h3>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Were you physically involved with a partner?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPhysicallyInvolved(false)}
                className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                  !physicallyInvolved
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => setPhysicallyInvolved(true)}
                className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                  physicallyInvolved
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Yes
              </button>
            </div>
          </div>

          {physicallyInvolved && (
            <div className="space-y-4 mt-4 pl-3 border-l-2 border-pink-200">
              <div>
                <label className="block mb-2 font-medium">
                  How many times?
                </label>
                <input
                  type="number"
                  value={timesInvolved}
                  onChange={(e) => setTimesInvolved(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter number"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  How many days ago?
                </label>
                <input
                  type="number"
                  value={daysAgo}
                  onChange={(e) => setDaysAgo(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter days"
                  min="0"
                  required
                />
              </div>

              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={protectionUsed}
                    onChange={(e) => setProtectionUsed(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  <span className="ml-3 font-medium">Used Protection</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Self-Pleasuring Section */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-purple-700">
            Solo Activity
          </h3>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Did you engage in self-pleasuring?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelfPleasuring(false)}
                className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                  !selfPleasuring
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => setSelfPleasuring(true)}
                className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                  selfPleasuring
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Yes
              </button>
            </div>
          </div>

          {selfPleasuring && (
            <div className="space-y-4 mt-4 pl-3 border-l-2 border-purple-200">
              <div>
                <label className="block mb-2 font-medium">
                  How many times?
                </label>
                <input
                  type="number"
                  value={selfPleasuringTimes}
                  onChange={(e) => setSelfPleasuringTimes(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter number"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  When was the last time?
                </label>
                <input
                  type="date"
                  value={lastSelfPleasure}
                  onChange={(e) => setLastSelfPleasure(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-purple-500 focus:border-purple-500"
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Partner Sharing Options */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">
            Sharing Preferences
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Select what information you want to share with your partner:
          </p>

          <div className="grid grid-cols-1 gap-2">
            {Object.keys(shareWithPartner).map((key) => (
              <div
                key={key}
                className="flex items-center p-2 hover:bg-blue-100 rounded-md transition-colors"
              >
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareWithPartner[key]}
                    onChange={() =>
                      setShareWithPartner((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 font-medium">{formatLabel(key)}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-md hover:from-pink-600 hover:to-purple-700 transition-colors focus:outline-none focus:ring-4 focus:ring-pink-300"
        >
          Save Activity Log
        </button>
      </form>
    </div>
  );
};

export default ActivityLog;
