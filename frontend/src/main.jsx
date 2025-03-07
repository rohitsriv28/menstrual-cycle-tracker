import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { PeriodProvider } from "./context/PeriodContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import ErroBoundary from "./components/ErrorBoundary.jsx";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <PeriodProvider>
        <UserProvider>
          <ErroBoundary>
            <App />
          </ErroBoundary>
        </UserProvider>
      </PeriodProvider>
    </Router>
  </React.StrictMode>
);
