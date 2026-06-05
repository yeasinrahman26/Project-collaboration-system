"use client";

import { useTasks } from "@/lib/hooks";
import { Card, CardTitle, CardContent } from "@/components/Common/Card";
import { Badge } from "@/components/Common/Badge";
import { AlertCircle } from "lucide-react";
import { SkeletonLoader } from "@/components/Common/Loading";

export function HighPriorityTasks() {
  const { highPriorityTasks, isLoading } = useTasks();

  if (isLoading) return <SkeletonLoader />;

  return (
    <Card>
      <CardTitle className="flex items-center gap-2 mb-6">
        <AlertCircle size={20} className="text-error" />
        High Priority Tasks
      </CardTitle>
      <CardContent>
        <div className="space-y-3">
          {highPriorityTasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No high priority tasks
            </p>
          ) : (
            highPriorityTasks.slice(0, 5).map((task) => (
              <div
                key={task._id}
                className="flex items-start justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {task.projectId?.name}
                  </p>
                </div>
                <Badge variant="error" size="sm">
                  {task.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
