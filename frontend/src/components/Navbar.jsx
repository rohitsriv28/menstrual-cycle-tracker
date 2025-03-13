import { useState, useContext, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { PeriodContext } from "../context/PeriodContext";
import { Menu, X, User, Calendar, Activity, Share2, Home } from "lucide-react";
import { format } from "date-fns"; 

// Separate Calendar component
const CalendarDropdown = ({ selectedDate, setSelectedDate, onClose }) => {
  return (
    <div className="p-2">
      <div className="bg-white text-gray-800 rounded-md shadow p-2">
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                const newDate = new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  i + 1
                );
                setSelectedDate(newDate);
                onClose();
              }}
              className={`text-sm p-1 rounded-full hover:bg-pink-100 ${
                selectedDate.getDate() === i + 1 ? "bg-pink-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  const { getCurrentPhase } = useContext(PeriodContext);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarRef = useRef(null);

  const currentPhase = getCurrentPhase();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-pink-500 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold flex items-center">
          <Calendar className="mr-2" />
          <span className="hidden sm:inline">Period Tracker</span>
        </NavLink>

        {/* Current cycle phase indicator */}
        <div className="hidden md:block bg-pink-600 px-3 py-1 rounded-full text-sm">
          {currentPhase}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          {/* Calendar Component */}
          <div className="relative" ref={calendarRef}>
            <button
              onClick={toggleCalendar}
              className="px-3 py-1 hover:bg-pink-600 rounded-md transition-colors flex items-center"
              aria-label="Open calendar"
            >
              <Calendar size={18} className="mr-1" />
              <span className="hidden sm:inline">
                {format(selectedDate, "MMM d")}
              </span>
            </button>

            {showCalendar && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
                <CalendarDropdown 
                  selectedDate={selectedDate} 
                  setSelectedDate={setSelectedDate} 
                  onClose={() => setShowCalendar(false)}
                />
              </div>
            )}
          </div>
          
          {/* Navigation Links */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "bg-pink-700 px-3 py-1 rounded-md"
                : "px-3 py-1 hover:bg-pink-600 rounded-md transition-colors"
            }
          >
            <div className="flex items-center">
              <Home size={18} className="mr-1" />
              Home
            </div>
          </NavLink>
          <NavLink
            to="/log-period"
            className={({ isActive }) =>
              isActive
                ? "bg-pink-700 px-3 py-1 rounded-md"
                : "px-3 py-1 hover:bg-pink-600 rounded-md transition-colors"
            }
          >
            <div className="flex items-center">
              <Calendar size={18} className="mr-1" />
              Log Period
            </div>
          </NavLink>
          <NavLink
            to="/cycle-prediction"
            className={({ isActive }) =>
              isActive
                ? "bg-pink-700 px-3 py-1 rounded-md"
                : "px-3 py-1 hover:bg-pink-600 rounded-md transition-colors"
            }
          >
            <div className="flex items-center">
              <Calendar size={18} className="mr-1" />
              Cycle
            </div>
          </NavLink>
          <NavLink
            to="/activity-log"
            className={({ isActive }) =>
              isActive
                ? "bg-pink-700 px-3 py-1 rounded-md"
                : "px-3 py-1 hover:bg-pink-600 rounded-md transition-colors"
            }
          >
            <div className="flex items-center">
              <Activity size={18} className="mr-1" />
              Activity
            </div>
          </NavLink>
          <NavLink
            to="/partner-sharing"
            className={({ isActive }) =>
              isActive
                ? "bg-pink-700 px-3 py-1 rounded-md"
                : "px-3 py-1 hover:bg-pink-600 rounded-md transition-colors"
            }
          >
            <div className="flex items-center">
              <Share2 size={18} className="mr-1" />
              Share
            </div>
          </NavLink>
          {user ? (
            <button
              onClick={logout}
              className="px-3 py-1 hover:bg-pink-600 rounded-md transition-colors"
            >
              <div className="flex items-center">
                <User size={18} className="mr-1" />
                Logout
              </div>
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "bg-pink-700 px-3 py-1 rounded-md"
                  : "px-3 py-1 hover:bg-pink-600 rounded-md transition-colors"
              }
            >
              <div className="flex items-center">
                <User size={18} className="mr-1" />
                Login
              </div>
            </NavLink>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden pt-2 pb-4 px-2 space-y-2 bg-pink-500">
          <div className="bg-pink-600 px-3 py-1 mb-2 rounded-full text-sm text-center">
            {currentPhase}
          </div>
          
          {/* Calendar in mobile view */}
          <div className="relative mb-2" ref={calendarRef}>
            <button
              onClick={toggleCalendar}
              className="block w-full text-left px-4 py-2 hover:bg-pink-600 rounded-md flex items-center"
              aria-label="Open calendar"
            >
              <Calendar size={18} className="mr-2" />
              {format(selectedDate, "MMMM d, yyyy")}
            </button>
            
            {showCalendar && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50">
                <CalendarDropdown 
                  selectedDate={selectedDate} 
                  setSelectedDate={setSelectedDate} 
                  onClose={() => setShowCalendar(false)}
                />
              </div>
            )}
          </div>
          
          {/* Mobile Navigation Links */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "block bg-pink-700 px-4 py-2 rounded-md"
                : "block px-4 py-2 hover:bg-pink-600 rounded-md"
            }
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center">
              <Home size={18} className="mr-2" />
              Home
            </div>
          </NavLink>
          <NavLink
            to="/log-period"
            className={({ isActive }) =>
              isActive
                ? "block bg-pink-700 px-4 py-2 rounded-md"
                : "block px-4 py-2 hover:bg-pink-600 rounded-md"
            }
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center">
              <Calendar size={18} className="mr-2" />
              Log Period
            </div>
          </NavLink>
          <NavLink
            to="/cycle-prediction"
            className={({ isActive }) =>
              isActive
                ? "block bg-pink-700 px-4 py-2 rounded-md"
                : "block px-4 py-2 hover:bg-pink-600 rounded-md"
            }
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center">
              <Calendar size={18} className="mr-2" />
              Cycle Prediction
            </div>
          </NavLink>
          <NavLink
            to="/activity-log"
            className={({ isActive }) =>
              isActive
                ? "block bg-pink-700 px-4 py-2 rounded-md"
                : "block px-4 py-2 hover:bg-pink-600 rounded-md"
            }
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center">
              <Activity size={18} className="mr-2" />
              Activity Log
            </div>
          </NavLink>
          <NavLink
            to="/partner-sharing"
            className={({ isActive }) =>
              isActive
                ? "block bg-pink-700 px-4 py-2 rounded-md"
                : "block px-4 py-2 hover:bg-pink-600 rounded-md"
            }
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center">
              <Share2 size={18} className="mr-2" />
              Partner Sharing
            </div>
          </NavLink>
          {user ? (
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-pink-600 rounded-md"
            >
              <div className="flex items-center">
                <User size={18} className="mr-2" />
                Logout
              </div>
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "block bg-pink-700 px-4 py-2 rounded-md"
                  : "block px-4 py-2 hover:bg-pink-600 rounded-md"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <User size={18} className="mr-2" />
                Login
              </div>
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;