import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import routing components
import "./index.css";
import App from "./App.jsx";
import SharePage from "./SharePage.jsx"; // Import the SharePage component

// Render the app with routing
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Default route for the main app */}
        <Route path="/" element={<App />} />

        {/* Route for the shareable page */}
        <Route path="/share/:shareId" element={<SharePage />} />
      </Routes>
    </Router>
  </StrictMode>
);