"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { openModal } from "@/lib/redux/slices/uiSlice";
import { useNotifications, useDarkMode } from "@/lib/hooks";
import { DarkModeToggle } from "@/components/Common/DarkModeToggle";
import { Bell, Search, Menu } from "lucide-react";
import { NotificationBell } from "../Notifications";
import SearchBar from "../Search/SearchResults";

export function Navbar() {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useNotifications();
  const { darkMode } = useDarkMode();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
          <Search size={18} className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search projects, tasks..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search Mobile */}
          <SearchBar />
          {/* Dark Mode Toggle */}
          <DarkModeToggle />
          {/* Notifications */}
          \<NotificationBell />
          {/* Mobile Menu Button (for future use) */}
          <button className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Menu size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </nav>
  );
}
