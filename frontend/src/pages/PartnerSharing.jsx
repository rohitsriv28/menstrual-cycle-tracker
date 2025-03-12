import { useContext, useState } from "react";
import { PeriodContext } from "../context/PeriodContext";
import { UserContext } from "../context/UserContext";

const PartnerSharing = () => {
  const {
    periodData,
    cycleLength,
    getNextPeriodDate,
    getFertileWindow,
    getCurrentPhase,
  } = useContext(PeriodContext);

  const {
    sharingSettings,
    updateSharingOptions,
    createSharingLink,
    deactivateLink,
    deleteLink,
  } = useContext(UserContext);

  // Initialize sharing options from context
  const [sharingOptions, setSharingOptions] = useState(sharingSettings.options);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shareableLinkData, setShareableLinkData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleOptionChange = (option) => {
    const newOptions = {
      ...sharingOptions,
      [option]: !sharingOptions[option],
    };
    setSharingOptions(newOptions);
    // Update the options in context as well
    updateSharingOptions(newOptions);
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
      // Use the createSharingLink function from UserContext
      const linkData = createSharingLink(password);

      setShareableLinkData(linkData);
      setLoading(false);
      setSuccessMessage("Sharing link created successfully!");

      // Reset this message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
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

  const handleCreateAnother = () => {
    setShareableLinkData(null);
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleManageSharing = () => {
    // Navigate to sharing management page
    // In a real implementation, you would use React Router here
    window.location.href = "/manage-sharing";
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
        Partner Sharing
      </h2>

      {successMessage && (
        <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {!shareableLinkData ? (
        <form className="space-y-6">
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

          {/* Sharing Options Section */}
          <div className="bg-pink-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-pink-700">
              What would you like to share?
            </h3>

            <div className="space-y-3">
              <div className="flex items-center p-2 hover:bg-pink-100 rounded-md transition-colors">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sharingOptions.nextPeriod}
                    onChange={() => handleOptionChange("nextPeriod")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  <span className="ml-3 font-medium">Next Period Date</span>
                </label>
              </div>

              <div className="flex items-center p-2 hover:bg-pink-100 rounded-md transition-colors">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sharingOptions.fertileWindow}
                    onChange={() => handleOptionChange("fertileWindow")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  <span className="ml-3 font-medium">Fertile Window</span>
                </label>
              </div>

              <div className="flex items-center p-2 hover:bg-pink-100 rounded-md transition-colors">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sharingOptions.currentPhase}
                    onChange={() => handleOptionChange("currentPhase")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  <span className="ml-3 font-medium">Current Cycle Phase</span>
                </label>
              </div>

              <div className="flex items-center p-2 hover:bg-pink-100 rounded-md transition-colors">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sharingOptions.historicalData}
                    onChange={() => handleOptionChange("historicalData")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  <span className="ml-3 font-medium">
                    Historical Period Data
                  </span>
                </label>
              </div>

              <div className="flex items-center p-2 hover:bg-pink-100 rounded-md transition-colors">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sharingOptions.symptoms}
                    onChange={() => handleOptionChange("symptoms")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  <span className="ml-3 font-medium">Symptoms</span>
                </label>
              </div>

              <div className="flex items-center p-2 hover:bg-pink-100 rounded-md transition-colors">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sharingOptions.notifications}
                    onChange={() => handleOptionChange("notifications")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  <span className="ml-3 font-medium">
                    Real-time Notifications
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-purple-700">
              Set Access Password
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your partner will need this password to view your shared
              information.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter a secure password"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={generateShareableLink}
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
                Creating Link...
              </div>
            ) : (
              "Create Shareable Link"
            )}
          </button>
        </form>
      ) : (
        // Link Created Success View
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
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
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Sharing Link Created!
            </h3>
            <p className="text-gray-600">
              Your link expires in 30 days. Anyone with this link and password
              can view your selected cycle information.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium mb-2">Your shareable link:</p>
            <div className="flex">
              <input
                type="text"
                value={shareableLinkData.url}
                className="border border-gray-300 p-2 w-full rounded-l-md bg-white text-gray-700"
                readOnly
              />
              <button
                onClick={copyToClipboard}
                className="bg-pink-500 text-white p-2 rounded-r-md hover:bg-pink-600 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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

          <div className="flex gap-3">
            <button
              onClick={handleCreateAnother}
              className="flex-1 py-3 px-4 rounded-md border transition-colors bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Create Another Link
            </button>
            <button
              onClick={handleManageSharing}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-md hover:from-pink-600 hover:to-purple-700 transition-colors"
            >
              Manage Sharing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerSharing;
