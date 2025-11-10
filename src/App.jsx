import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./page/LoginPage";
// import LoginPage from "./pages/LoginPage";
import LoginPage from "./page/Loginpage.jsx"; // 🔹 Updated import to match filenam e

import AdminLayout from "./layout/AdminLayout"; // 🔹 Common layout with Sidebar
import AdminRewardPage from "./page/AdminRewardPage";
import Dashboard from "./page/Dashboard";
import "./App.css";
import AdminVerificationPage from "./component/AdminVerificationPage.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [])

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setIsLoggedIn(false);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        {!isLoggedIn && (
          <>
            <Route
              path="/"
              element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
            />
            <Route
              path="/login"
              element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* ================= PROTECTED ROUTES ================= */}
        {isLoggedIn && (
          <>
            <Route path="/" element={<AdminLayout onLogout={handleLogout} />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="admin/rewards" element={<AdminRewardPage />} />
              <Route path="admin/verify" element={<AdminVerificationPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
