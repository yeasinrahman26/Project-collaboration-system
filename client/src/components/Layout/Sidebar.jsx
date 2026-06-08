"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOpen } from "@/lib/redux/slices/uiSlice";
import { useAuth } from "@/lib/hooks";
import {
  Menu,
  X,
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  LogOut,
  User,
  Plus,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Define menu items with required roles
  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["Admin", "ProjectManager", "TeamMember"],
    },
    {
      label: "Projects",
      href: "/dashboard/projects",
      icon: FolderOpen,
      roles: ["Admin", "ProjectManager"],
    },
    {
      label: "Tasks",
      href: "/dashboard/tasks",
      icon: CheckSquare,
      roles: ["Admin", "ProjectManager", "TeamMember"],
    },
    // {
    //   label: "Add Task", // NEW
    //   href: "/dashboard/addTask", // NEW
    //   icon: Plus,
    //   roles: ["Admin", "ProjectManager"],
    // },
    {
      label: "Users",
      href: "/dashboard/users",
      icon: User,
      roles: ["Admin"],
    },
  ];

  // Filter items based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  const isActive = (href) => pathname === href;

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-primary text-white rounded-lg"
      >
        {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {showMobileMenu && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
          showMobileMenu ? "w-64" : "w-0 md:w-64"
        } overflow-hidden md:overflow-visible`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="mb-8 mt-12 md:mt-0">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TF</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:inline">
                Taskforge
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

          {/* User Section */}
          <div className="space-y-2">
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
              <User size={20} />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.role}
                </p>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-error hover:bg-red-50 dark:hover:bg-red-900 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
