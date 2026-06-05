"use client";

import {
  KPICards,
  Charts,
  RecentActivities,
  UpcomingDeadlines,
  HighPriorityTasks,
  ProjectSummary,
} from "@/components/Dashboard";

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome! Here's your project overview
        </p>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Charts */}
      <Charts />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivities />
          <ProjectSummary />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <UpcomingDeadlines />
          <HighPriorityTasks />
        </div>
      </div>
    </div>
  );
}
