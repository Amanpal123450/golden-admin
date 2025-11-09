import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/Sidebar";

export default function AdminLayout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={onLogout}
      />
      <div className="flex-1 overflow-y-auto p-4">
        <Outlet /> {/* 🔹 This will show Dashboard / Rewards dynamically */}
      </div>
    </div>
  );
}
