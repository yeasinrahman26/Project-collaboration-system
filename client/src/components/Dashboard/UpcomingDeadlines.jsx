"use client";

import { useTasks } from "@/lib/hooks";
import { Card, CardTitle, CardContent } from "@/components/Common/Card";
import { formatDate } from "@/lib/utils/formatters";
import { Calendar, AlertCircle } from "lucide-react";
import { Badge } from "@/components/Common/Badge";
import { SkeletonLoader } from "@/components/Common/Loading";

export function UpcomingDeadlines() {
  const { upcomingDeadlines, isLoading } = useTasks();

  if (isLoading) return <SkeletonLoader />;

  const getDaysUntilDeadline = (dueDate) => {
    const today = new Date();
    const deadline = new Date(dueDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysLeft) => {
    if (daysLeft <= 1) return "error";
    if (daysLeft <= 3) return "warning";
    return "primary";
  };

  return (
    <Card>
      <CardTitle className="flex items-center gap-2 mb-6">
        <Calendar size={20} />
        Upcoming Deadlines
      </CardTitle>
      <CardContent>
        <div className="space-y-3">
          {upcomingDeadlines.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No upcoming deadlines
            </p>
          ) : (
            upcomingDeadlines.slice(0, 5).map((task) => {
              const daysLeft = getDaysUntilDeadline(task.dueDate);
              return (
                <div
                  key={task._id}
                  className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {task.projectId?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {daysLeft <= 1 && (
                      <AlertCircle size={16} className="text-error" />
                    )}
                    <Badge variant={getUrgencyColor(daysLeft)} size="sm">
                      {daysLeft} days
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
