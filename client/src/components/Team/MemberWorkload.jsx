"use client";

import { useEffect, useState } from "react";
import api from "@/lib/utils/api";
import { Card, CardTitle, CardContent } from "@/components/Common/Card";
import { Badge } from "@/components/Common/Badge";
import { Briefcase, CheckCircle, Clock } from "lucide-react";
import { SkeletonLoader } from "@/components/Common/Loading";

export function MemberWorkload({ members = [] }) {
  const [workload, setWorkload] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkload();
  }, [members]);

  const fetchWorkload = async () => {
    try {
      setLoading(true);
      const workloadData = {};

      for (const member of members) {
        try {
          const response = await api.get(
            `/dashboard/member/${member._id}/workload`,
          );
          workloadData[member._id] = response.data;
        } catch (error) {
          console.error(`Failed to fetch workload for ${member.name}:`, error);
        }
      }

      setWorkload(workloadData);
    } catch (error) {
      console.error("Failed to fetch workload:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SkeletonLoader />;

  if (members.length === 0) {
    return (
      <Card>
        <CardTitle className="flex items-center gap-2 mb-6">
          <Briefcase size={20} />
          Member Workload
        </CardTitle>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No team members
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle className="flex items-center gap-2 mb-6">
        <Briefcase size={20} />
        Member Workload
      </CardTitle>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => {
            const memberWorkload = workload[member._id];
            if (!memberWorkload) return null;

            const completionPercentage =
              memberWorkload.totalTasks === 0
                ? 0
                : Math.round(
                    (memberWorkload.completedTasks /
                      memberWorkload.totalTasks) *
                      100,
                  );

            return (
              <div
                key={member._id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                {/* Name & Progress */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </h4>
                  <Badge variant="primary" size="sm">
                    {completionPercentage}%
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mb-3">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Briefcase size={14} />
                    <span>{memberWorkload.totalTasks} tasks</span>
                  </div>
                  <div className="flex items-center gap-1 text-success">
                    <CheckCircle size={14} />
                    <span>{memberWorkload.completedTasks} done</span>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <Clock size={14} />
                    <span>{memberWorkload.pendingTasks} pending</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
