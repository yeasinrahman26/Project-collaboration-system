"use client";

import {
  useGetDashboardStatsQuery,
  useGetProjectSummaryQuery,
  useGetTaskStatusDistributionQuery,
} from "../redux/services/dashboardApi";

export const useDashboard = () => {
  const { data: dashboardStats = {}, isLoading: statsLoading } =
    useGetDashboardStatsQuery();
  const { data: projectSummary = [], isLoading: summaryLoading } =
    useGetProjectSummaryQuery();
  const { data: taskDistribution = {}, isLoading: distributionLoading } =
    useGetTaskStatusDistributionQuery();

  return {
    stats: dashboardStats,
    projectSummary,
    taskDistribution,
    isLoading: statsLoading || summaryLoading || distributionLoading,
  };
};
