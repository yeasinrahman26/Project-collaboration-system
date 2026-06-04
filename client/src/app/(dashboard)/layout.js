"use client";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar will go here */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar will go here */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
