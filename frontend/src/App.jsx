import React, { Suspense } from "react";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/Footer";
import SharedView from "./pages/SharedView";

const App = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen p-4 bg-gray-50">
        <Suspense fallback={<LoadingSpinner />}>
          <AppRoutes />
        </Suspense>
      </main>
      {/* <SharedView /> */}
      <Footer />
    </>
  );
};

export default App;
