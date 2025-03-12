import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const SharedView = () => {
  const { sharingId } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sharedData, setSharedData] = useState(null);
  const [sharingOptions, setSharingOptions] = useState(null);

  // On component mount, check if the sharing ID is valid
  useEffect(() => {
    // In a real implementation, this would be an API call
    const fetchSharingLink = () => {
      const sharingSettings = JSON.parse(
        localStorage.getItem("sharingSettings")
      ) || { links: [] };
      const link = sharingSettings.links.find(
        (l) => l.id === sharingId && l.isActive
      );

      if (!link) {
        setError("This sharing link is invalid or has been deactivated.");
        return;
      }

      // Check if link has expired
      if (new Date(link.expiresAt) < new Date()) {
        setError("This sharing link has expired.");
        return;
      }

      setSharingOptions(link.options);
    };

    fetchSharingLink();
  }, [sharingId]);

  const verifyPassword = () => {
    setLoading(true);
    setError("");

    // Simulating API call delay
    setTimeout(() => {
      // In a real implementation, this would verify against a hashed password on the server
      const storedPassword = localStorage.getItem(`share_${sharingId}_pass`);

      if (storedPassword === password) {
        setIsAuthenticated(true);
        fetchSharedData();
      } else {
        setError("Incorrect password. Please try again.");
      }

      setLoading(false);
    }, 800);
  };

  const fetchSharedData = () => {
    // In a real implementation, this would be an API call to get the authorized data
    // For this example, we'll simulate it with mock data
    const periodData = JSON.parse(localStorage.getItem("periodData")) || {
      lastPeriod: "2025-02-18",
      cycleLength: 28,
      periodLength: 5,
      symptoms: [
        { date: "2025-02-18", type: "cramps", severity: "moderate" },
        { date: "2025-02-19", type: "headache", severity: "mild" },
        { date: "2025-02-20", type: "fatigue", severity: "severe" },
      ],
      historicalData: [
        { startDate: "2025-01-21", endDate: "2025-01-26" },
        { startDate: "2024-12-24", endDate: "2024-12-29" },
        { startDate: "2024-11-27", endDate: "2024-12-02" },
      ],
    };

    // Calculate next period date and fertile window
    const nextPeriodDate = new Date(periodData.lastPeriod);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + periodData.cycleLength);

    // Calculate fertile window (simplified: cycle day 11-17)
    const fertileStart = new Date(periodData.lastPeriod);
    fertileStart.setDate(fertileStart.getDate() + 10); // Cycle day 11

    const fertileEnd = new Date(periodData.lastPeriod);
    fertileEnd.setDate(fertileEnd.getDate() + 16); // Cycle day 17

    // Calculate current phase
    const today = new Date();
    const lastPeriodDate = new Date(periodData.lastPeriod);
    const daysSinceLastPeriod = Math.floor(
      (today - lastPeriodDate) / (1000 * 60 * 60 * 24)
    );

    let currentPhase = "";
    if (daysSinceLastPeriod < periodData.periodLength) {
      currentPhase = "Menstrual";
    } else if (daysSinceLastPeriod < 7) {
      currentPhase = "Follicular";
    } else if (daysSinceLastPeriod >= 10 && daysSinceLastPeriod <= 16) {
      currentPhase = "Ovulatory";
    } else {
      currentPhase = "Luteal";
    }

    setSharedData({
      nextPeriodDate: nextPeriodDate.toISOString().split("T")[0],
      fertileWindow: {
        start: fertileStart.toISOString().split("T")[0],
        end: fertileEnd.toISOString().split("T")[0],
      },
      currentPhase,
      historicalData: periodData.historicalData,
      symptoms: periodData.symptoms,
    });
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (error && !sharingOptions) {
    return (
      <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-lg mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-red-500 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-red-700">Link Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
          <p className="text-gray-600">
            If you believe this is a mistake, please contact the person who
            shared this link with you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      {!isAuthenticated ? (
        // Password Verification Screen
        <div>
          <div className="text-center mb-6">
            <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Shared Cycle Information
            </h2>
            <p className="text-gray-600 mt-2">
              This information has been shared with you privately.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-700 text-sm">
              <span className="font-medium">Privacy note:</span> This
              information is confidential and password-protected. Please respect
              the privacy of the person who shared this data with you.
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Enter Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-3 w-full rounded-md focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter the password you were given"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={verifyPassword}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-md hover:from-pink-600 hover:to-purple-700 transition-colors focus:outline-none focus:ring-4 focus:ring-pink-300"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
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
                  Verifying...
                </div>
              ) : (
                "Access Shared Information"
              )}
            </button>
          </form>
        </div>
      ) : (
        // Shared Information Dashboard
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-pink-600">
              Cycle Information
            </h2>
            <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              Verified Access
            </div>
          </div>

          {/* Display the shared information according to sharing options */}
          <div className="space-y-6">
            {sharingOptions.nextPeriod && sharedData && (
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-pink-700 mb-2">
                  Next Period
                </h3>
                <p className="text-gray-800 font-medium">
                  Expected on {formatDate(sharedData.nextPeriodDate)}
                </p>
              </div>
            )}

            {sharingOptions.fertileWindow && sharedData && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-700 mb-2">
                  Fertile Window
                </h3>
                <p className="text-gray-800 font-medium">
                  From {formatDate(sharedData.fertileWindow.start)} to{" "}
                  {formatDate(sharedData.fertileWindow.end)}
                </p>
              </div>
            )}

            {sharingOptions.currentPhase && sharedData && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  Current Cycle Phase
                </h3>
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      sharedData.currentPhase === "Menstrual"
                        ? "bg-red-500"
                        : sharedData.currentPhase === "Follicular"
                        ? "bg-yellow-500"
                        : sharedData.currentPhase === "Ovulatory"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <p className="text-gray-800 font-medium">
                    {sharedData.currentPhase} Phase
                  </p>
                </div>
              </div>
            )}

            {sharingOptions.historicalData && sharedData && (
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                  Recent Period History
                </h3>
                <div className="space-y-2">
                  {sharedData.historicalData.map((period, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-800"
                    >
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <p>
                        {formatDate(period.startDate)} -{" "}
                        {formatDate(period.endDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sharingOptions.symptoms && sharedData && (
              <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-teal-700 mb-2">
                  Recent Symptoms
                </h3>
                <div className="space-y-3">
                  {sharedData.symptoms.map((symptom, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-md shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium capitalize">{symptom.type}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            symptom.severity === "mild"
                              ? "bg-green-100 text-green-700"
                              : symptom.severity === "moderate"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {symptom.severity}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {formatDate(symptom.date)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sharingOptions.notifications && (
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-700 mb-2">
                  Notifications
                </h3>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p className="text-gray-800">
                    You will receive real-time notifications about cycle
                    updates.
                  </p>
                </div>
              </div>
            )}

            {/* Note when no data is being shared */}
            {!Object.values(sharingOptions).some(
              (option) => option === true
            ) && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-600">
                  No specific information has been shared with you at this time.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              This information is updated automatically. Last updated:{" "}
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedView;
