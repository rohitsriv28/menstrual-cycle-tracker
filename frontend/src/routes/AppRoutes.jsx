import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";

// Lazy load components
const Home = lazy(() => import("../pages/Home"));
const LogPeriod = lazy(() => import("../pages/LogPeriod"));
const CyclePrediction = lazy(() => import("../pages/CyclePrediction"));
const Symptoms = lazy(() => import("../pages/Symptoms"));
const ActivityLog = lazy(() => import("../pages/ActivityLog"));
const WaterSleepLog = lazy(() => import("../pages/WaterSleepLog"));
const PartnerSharing = lazy(() => import("../pages/PartnerSharing"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/log-period" element={<LogPeriod />} />
        <Route path="/cycle-prediction" element={<CyclePrediction />} />
        <Route path="/symptoms" element={<Symptoms />} />
        <Route path="/activity-log" element={<ActivityLog />} />
        <Route path="/water-sleep-log" element={<WaterSleepLog />} />
        <Route path="/partner-sharing" element={<PartnerSharing />} />
        <Route
          path="*"
          element={<div className="text-center mt-10">404 Not Found</div>}
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
