"use client";

import { useDashboard } from "@/lib/hooks";
import { Card, CardTitle, CardContent } from "@/components/Common/Card";
import { Badge } from "@/components/Common/Badge";
import { FolderOpen } from "lucide-react";
import { SkeletonLoader } from "@/components/Common/Loading";

export function ProjectSummary() {
  const { projectSummary, isLoading } = useDashboard();

  if (isLoading) return <SkeletonLoader />;

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "primary";
      case "Completed":
        return "success";
      case "OnHold":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardTitle className="flex items-center gap-2 mb-6">
        <FolderOpen size={20} />
        Project Summary
      </CardTitle>
      <CardContent>
        <div className="space-y-4">
          {projectSummary.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No projects yet
            </p>
          ) : (
            projectSummary.map((project) => (
              <div
                key={project.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {project.name}
                  </h4>
                  <Badge variant={getStatusColor(project.status)} size="sm">
                    {project.status}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Progress
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {project.completionPercentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.completionPercentage}%` }}
                    ></div>
                  </div>

                  {/* Task Counts */}
                  <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400 pt-2">
                    <span>Total: {project.totalTasks}</span>
                    <span>✓ Completed: {project.completedTasks}</span>
                    <span>⏳ Pending: {project.pendingTasks}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
