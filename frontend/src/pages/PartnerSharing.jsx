import { useContext, useState } from "react";
import { PeriodContext } from "../context/PeriodContext";

const PartnerSharing = () => {
  const {
    periodData,
    cycleLength,
    getNextPeriodDate,
    getFertileWindow,
    getCurrentPhase,
  } = useContext(PeriodContext);

  const [sharingOptions, setSharingOptions] = useState({
    nextPeriod: true,
    fertileWindow: true,
    currentPhase: true,
    historicalData: false,
    symptoms: false,
    notifications: false,
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shareableLinkData, setShareableLinkData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleOptionChange = (option) => {
    setSharingOptions({
      ...sharingOptions,
      [option]: !sharingOptions[option],
    });
  };

  const validateForm = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!Object.values(sharingOptions).some((option) => option === true)) {
      setError("Please select at least one item to share");
      return false;
    }

    return true;
  };

  const generateShareableLink = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // Here we would normally make an API call to the backend
      // For now, we'll simulate it with a timeout

      setTimeout(() => {
        // Create a sharing identifier (in real implementation, this would be a secure token from the backend)
        const sharingId =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);

        const linkData = {
          url: `${window.location.origin}/shared/${sharingId}`,
          expiresInDays: 30,
          createdAt: new Date().toISOString(),
        };

        setShareableLinkData(linkData);
        setLoading(false);
        setSuccessMessage("Sharing link created successfully!");

        // Reset this message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
      }, 1500);
    } catch (err) {
      setError("Failed to create shareable link. Please try again.");
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!shareableLinkData) return;

    navigator.clipboard
      .writeText(shareableLinkData.url)
      .then(() => {
        setSuccessMessage("Link copied to clipboard!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch(() => {
        setError("Failed to copy link. Please try again.");
      });
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Partner Sharing</h2>
      </div>

      {!shareableLinkData ? (
        <>
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Share your cycle information with your partner. Select what you
              want to share and create a secure, password-protected link.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Privacy note:</span> Your partner
                will need the password you set to view your shared information.
                You can disable sharing at any time.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              What would you like to share?
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">Next Period Date</p>
                  <p className="text-sm text-gray-500">
                    When your next period is expected to start
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={sharingOptions.nextPeriod}
                    onChange={() => handleOptionChange("nextPeriod")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">Fertile Window</p>
                  <p className="text-sm text-gray-500">
                    When you're most likely to conceive
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={sharingOptions.fertileWindow}
                    onChange={() => handleOptionChange("fertileWindow")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">
                    Current Cycle Phase
                  </p>
                  <p className="text-sm text-gray-500">
                    What phase of your cycle you're in right now
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={sharingOptions.currentPhase}
                    onChange={() => handleOptionChange("currentPhase")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">
                    Historical Period Data
                  </p>
                  <p className="text-sm text-gray-500">
                    Your past period dates and durations
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={sharingOptions.historicalData}
                    onChange={() => handleOptionChange("historicalData")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">Symptoms</p>
                  <p className="text-sm text-gray-500">
                    Symptoms you've recorded during your periods
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={sharingOptions.symptoms}
                    onChange={() => handleOptionChange("symptoms")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">
                    Real-time Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Allow your partner to receive notifications about your cycle
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={sharingOptions.notifications}
                    onChange={() => handleOptionChange("notifications")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Set Access Password
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your partner will need this password to view your shared
              information.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter a secure password"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-6">
              <p className="text-sm text-green-500">{successMessage}</p>
            </div>
          )}

          <button
            onClick={generateShareableLink}
            className={`bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition w-full flex justify-center items-center ${
              loading ? "opacity-75" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
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
              "Create Shareable Link"
            )}
          </button>
        </>
      ) : (
        <div className="text-center">
          <div className="mb-6">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Sharing Link Created!
            </h3>
            <p className="text-gray-600 mb-6">
              Your link expires in 30 days. Anyone with this link and password
              can view your selected cycle information.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-800 font-medium mb-2">
              Your shareable link:
            </p>
            <div className="flex items-center">
              <input
                type="text"
                value={shareableLinkData.url}
                className="border border-gray-300 p-3 w-full rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white text-gray-700"
                readOnly
              />
              <button
                onClick={copyToClipboard}
                className="bg-pink-500 text-white p-3 rounded-r-lg hover:bg-pink-600 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-6">
              <p className="text-sm text-green-500">{successMessage}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => setShareableLinkData(null)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition"
            >
              Create Another Link
            </button>
            <button className="flex-1 bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition">
              Manage Sharing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerSharing;
