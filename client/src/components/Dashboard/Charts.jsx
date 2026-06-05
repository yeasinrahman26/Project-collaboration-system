"use client";

import { useDashboard } from "@/lib/hooks";
import { Card, CardContent, CardTitle } from "@/components/Common/Card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SkeletonLoader } from "@/components/Common/Loading";

export function Charts() {
  const { stats, taskDistribution, isLoading } = useDashboard();

  if (isLoading) return <SkeletonLoader />;

  // Tasks by Priority
  const priorityData = [
    {
      name: "High",
      value: stats.priorityBreakdown?.high || 0,
      fill: "#ef4444",
    },
    {
      name: "Medium",
      value: stats.priorityBreakdown?.medium || 0,
      fill: "#f59e0b",
    },
    { name: "Low", value: stats.priorityBreakdown?.low || 0, fill: "#10b981" },
  ];

  // Task Status Distribution
  const statusData = Object.entries(taskDistribution || {}).map(
    ([key, value]) => ({
      name: key,
      value: value,
    }),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Tasks by Priority */}
      <Card>
        <CardTitle className="mb-6">Tasks by Priority</CardTitle>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Task Status Distribution */}
      <Card>
        <CardTitle className="mb-6">Task Status Distribution</CardTitle>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
