export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  PROFILE: "/auth/profile",
  UPDATE_PROFILE: "/auth/profile-picture",

  // Projects
  PROJECTS: "/projects",
  PROJECTS_STATS: "/projects/:id/stats",

  // Tasks
  TASKS: "/tasks",
  HIGH_PRIORITY_TASKS: "/tasks/priority/high",
  UPCOMING_DEADLINES: "/tasks/deadline/upcoming",
  OVERDUE_TASKS: "/tasks/deadline/overdue",

  // Comments
  COMMENTS: "/comments/:taskId/comments",

  // Notifications
  NOTIFICATIONS: "/notifications",

  // Dashboard
  DASHBOARD_STATS: "/dashboard/stats",
  PROJECT_SUMMARY: "/dashboard/projects-summary",
  TASK_DISTRIBUTION: "/dashboard/task-distribution",
  MEMBER_WORKLOAD: "/dashboard/member/:memberId/workload",

  // Search
  SEARCH_PROJECTS: "/search/projects",
  SEARCH_TASKS: "/search/tasks",
  SEARCH_MEMBERS: "/search/members",

  // Activities
  ACTIVITIES: "/activities",
};

export const TASK_STATUS = {
  TODO: "Todo",
  IN_PROGRESS: "InProgress",
  COMPLETED: "Completed",
};

export const TASK_PRIORITY = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const PROJECT_STATUS = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
};

export const USER_ROLES = {
  ADMIN: "Admin",
  PROJECT_MANAGER: "ProjectManager",
  TEAM_MEMBER: "TeamMember",
};

export const PRIORITY_COLORS = {
  [TASK_PRIORITY.HIGH]: "#ef4444",
  [TASK_PRIORITY.MEDIUM]: "#f59e0b",
  [TASK_PRIORITY.LOW]: "#10b981",
};

export const STATUS_COLORS = {
  [TASK_STATUS.TODO]: "#6b7280",
  [TASK_STATUS.IN_PROGRESS]: "#3b82f6",
  [TASK_STATUS.COMPLETED]: "#10b981",
};

export const DEMO_CREDENTIALS = {
  email: "admin@demo.com",
  password: "password123",
};
