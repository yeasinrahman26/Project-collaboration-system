"use client";

import { useEffect, useState } from "react";
import api from "@/lib/utils/api";
import { Card, CardTitle, CardContent } from "@/components/Common/Card";
import { formatRelativeTime } from "@/lib/utils/formatters";
import { Activity } from "lucide-react";
import { SkeletonLoader } from "@/components/Common/Loading";

export function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get("/activities?limit=10&page=1");
        setActivities(response.data.activities);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <SkeletonLoader />;

  const getActivityIcon = (action) => {
    switch (action) {
      case "created":
        return "✨";
      case "updated":
        return "✏️";
      case "assigned":
        return "👤";
      case "member_added":
        return "👥";
      default:
        return "📝";
    }
  };

  return (
    <Card>
      <CardTitle className="flex items-center gap-2 mb-6">
        <Activity size={20} />
        Recent Activities
      </CardTitle>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No activities yet
            </p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                {/* Icon */}
                <div className="text-2xl flex-shrink-0">
                  {getActivityIcon(activity.action)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    by {activity.userId?.name || "Unknown"}
                  </p>
                </div>

                {/* Time */}
                <div className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 text-right">
                  {formatRelativeTime(activity.timestamp)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
