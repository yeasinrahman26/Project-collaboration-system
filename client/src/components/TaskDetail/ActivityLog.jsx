"use client";

import { useEffect, useState } from "react";
import api from "@/lib/utils/api";
import { formatRelativeTime } from "@/lib/utils/formatters";
import { History } from "lucide-react";

export function ActivityLog({ taskId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [taskId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/activities?limit=50&page=1`);
      // Filter activities for this task
      const taskActivities = response.data.activities.filter(
        (activity) => activity.taskId?._id === taskId,
      );
      setActivities(taskActivities);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action) => {
    switch (action) {
      case "created":
        return "✨";
      case "updated":
        return "✏️";
      case "assigned":
        return "👤";
      default:
        return "📝";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <History size={20} className="text-secondary" />
        <h3 className="font-bold text-gray-900 dark:text-white">
          Activity Log
        </h3>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Loading activities...
          </p>
        ) : activities.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No activity yet
          </p>
        ) : (
          activities.map((activity, index) => (
            <div key={activity._id} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className="text-2xl">
                  {getActivityIcon(activity.action)}
                </div>
                {index !== activities.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600 my-2"></div>
                )}
              </div>

              {/* Content */}
              <div className="pb-4 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {activity.userId?.name}
                  </p>
                  <span className="text-xs text-gray-400">•</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
