import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { PeriodContext } from "../context/PeriodContext";
import { Calendar, Heart, MessageCircle, Info, Shield, Mail } from "lucide-react";

const Footer = () => {
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);
  const { user } = useContext(UserContext);
  const { getNextPeriodDate, getCurrentPhase } = useContext(PeriodContext);
  
  const nextPeriod = getNextPeriodDate();
  const currentPhase = getCurrentPhase();
  
  const toggleResourceDropdown = () => {
    setShowResourceDropdown(!showResourceDropdown);
  };

  return (
    <footer className="bg-gray-800 text-white pt-6 pb-4 mt-8">
      <div className="container mx-auto px-4">
        {/* Top Section with App Summary and Quick Status */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold flex items-center justify-center md:justify-start">
              <Calendar className="mr-2" />
              Period Tracker
            </h2>
            <p className="text-gray-400 mt-1 text-center md:text-left">Your personal cycle companion</p>
          </div>
          
          {user && (
            <div className="flex flex-col items-center md:items-end">
              <div className="flex flex-wrap justify-center md:justify-end gap-2">
                <div className="bg-pink-600 px-3 py-1 rounded-full text-sm">
                  Phase: {currentPhase}
                </div>
                {nextPeriod && (
                  <div className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                    Next Period: {new Date(nextPeriod).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Middle Section with Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/log-period" className="text-gray-400 hover:text-pink-400 flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Log Period
                </Link>
              </li>
              <li>
                <Link to="/cycle-prediction" className="text-gray-400 hover:text-pink-400 flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Cycle Prediction
                </Link>
              </li>
              <li>
                <Link to="/activity-log" className="text-gray-400 hover:text-pink-400 flex items-center">
                  <Heart size={14} className="mr-1" />
                  Activity Log
                </Link>
              </li>
              <li>
                <Link to="/partner-sharing" className="text-gray-400 hover:text-pink-400 flex items-center">
                  <MessageCircle size={14} className="mr-1" />
                  Partner Sharing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={toggleResourceDropdown}
                  className="text-gray-400 hover:text-pink-400 flex items-center"
                >
                  <Info size={14} className="mr-1" />
                  Health Resources
                </button>
                {showResourceDropdown && (
                  <div className="pl-5 mt-2 space-y-1">
                    <a href="https://www.womenshealth.gov/menstrual-cycle" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-gray-400 hover:text-pink-400 text-sm"
                    >
                      Women's Health
                    </a>
                    <a href="https://www.plannedparenthood.org/learn/health-and-wellness/menstruation" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-gray-400 hover:text-pink-400 text-sm"
                    >
                      Planned Parenthood
                    </a>
                    <a href="https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20047186" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-gray-400 hover:text-pink-400 text-sm"
                    >
                      Mayo Clinic
                    </a>
                  </div>
                )}
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-pink-400 flex items-center">
                  <Info size={14} className="mr-1" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-pink-400">
                  Health Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-pink-400">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-pink-400 flex items-center">
                  <Mail size={14} className="mr-1" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-gray-400 hover:text-pink-400">
                  Submit Feedback
                </Link>
              </li>
              <li>
                <Link to="/report-bug" className="text-gray-400 hover:text-pink-400">
                  Report a Bug
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-pink-400 flex items-center">
                  <Shield size={14} className="mr-1" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-pink-400 flex items-center">
                  <Shield size={14} className="mr-1" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/data-policy" className="text-gray-400 hover:text-pink-400">
                  Data Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section with Copyright */}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm text-center md:text-left mb-2 md:mb-0">
              &copy; {new Date().getFullYear()} Period Tracker App. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400"
                aria-label="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-pink-400"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-pink-400"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;