import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Period Tracker</h1>
      <p className="mb-6 text-gray-600">Manage your cycle, track symptoms, and stay informed about your health.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          to="/log-period" 
          className="bg-pink-500 text-white p-4 rounded-lg hover:bg-pink-600 transition duration-300"
          aria-label="Log Period"
        >
          Log Period
        </Link>
        <Link 
          to="/cycle-prediction" 
          className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition duration-300"
          aria-label="Cycle Prediction"
        >
          Cycle Prediction
        </Link>
        <Link 
          to="/symptoms" 
          className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition duration-300"
          aria-label="Log Symptoms"
        >
          Log Symptoms
        </Link>
        <Link 
          to="/activity-log" 
          className="bg-red-500 text-white p-4 rounded-lg hover:bg-red-600 transition duration-300"
          aria-label="Activity Log"
        >
          Activity Log
        </Link>
        <Link 
          to="/water-sleep-log" 
          className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition duration-300"
          aria-label="Water & Sleep"
        >
          Water & Sleep
        </Link>
        <Link 
          to="/partner-sharing" 
          className="bg-yellow-500 text-white p-4 rounded-lg hover:bg-yellow-600 transition duration-300"
          aria-label="Partner Sharing"
        >
          Partner Sharing
        </Link>
      </div>
    </div>
  );
};

export default Home;