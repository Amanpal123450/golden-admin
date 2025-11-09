import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Menu, 
  X 
} from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeMenu, setActiveMenu }) {
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { id: "rewards", icon: Users, label: "Create Coupon", path: "/admin/rewards" },
  ];

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
    >
      {/* Logo + Toggle Button */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeMenu === item.id || location.pathname === item.path;

          return (
            <Link key={item.id} to={item.path}>
              <button
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
            AD
          </div>
          {sidebarOpen && (
            <div className="flex-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-400">admin@example.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
