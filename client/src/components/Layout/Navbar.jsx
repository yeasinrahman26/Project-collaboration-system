"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { openModal } from "@/lib/redux/slices/uiSlice";
import { useNotifications, useDarkMode } from "@/lib/hooks";
import { DarkModeToggle } from "@/components/Common/DarkModeToggle";
import { Bell, Search, Menu } from "lucide-react";

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
          <button className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Search size={20} className="text-gray-600 dark:text-gray-400" />
          </button>

          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <Bell size={20} className="text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No notifications
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                          !notification.isRead
                            ? "bg-blue-50 dark:bg-blue-900"
                            : ""
                        }`}
                      >
                        <p className="font-medium text-sm text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button (for future use) */}
          <button className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Menu size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </nav>
  );
}
