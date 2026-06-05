"use client";

import { useDashboard } from "@/lib/hooks";
import { Card, CardContent } from "@/components/Common/Card";
import {
  FolderOpen,
  CheckSquare,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { SkeletonLoader } from "@/components/Common/Loading";

export function KPICards() {
  const { stats, isLoading } = useDashboard();

  if (isLoading) return <SkeletonLoader />;

  const kpis = [
    {
      label: "Total Projects",
      value: stats.projects?.total || 0,
      icon: FolderOpen,
      color: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Tasks",
      value: stats.tasks?.total || 0,
      icon: CheckSquare,
      color: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Completed Tasks",
      value: stats.tasks?.completed || 0,
      icon: CheckCircle,
      color: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Pending Tasks",
      value: stats.tasks?.pending || 0,
      icon: Clock,
      color: "bg-yellow-100 dark:bg-yellow-900",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Overdue Tasks",
      value: stats.tasks?.overdue || 0,
      icon: AlertCircle,
      color: "bg-red-100 dark:bg-red-900",
      iconColor: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {kpi.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {kpi.value}
                  </p>
                </div>
                <div className={`${kpi.color} p-3 rounded-lg`}>
                  <Icon size={24} className={kpi.iconColor} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
