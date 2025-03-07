import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-pink-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold">
          Period Tracker
        </NavLink>
        <div className="space-x-4">
          <NavLink
            to="/log-period"
            className={({ isActive }) =>
              isActive ? "underline" : "hover:underline"
            }
          >
            Log Period
          </NavLink>
          <NavLink
            to="/cycle-prediction"
            className={({ isActive }) =>
              isActive ? "underline" : "hover:underline"
            }
          >
            Cycle Prediction
          </NavLink>
          <NavLink
            to="/symptoms"
            className={({ isActive }) =>
              isActive ? "underline" : "hover:underline"
            }
          >
            Symptoms
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
