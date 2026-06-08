"use client";

import { formatDate } from "@/lib/utils/formatters";
import { Badge } from "@/components/Common/Badge";
import { Card } from "@/components/Common/Card";
import {
  FolderOpen,
  Calendar,
  Users,
  Edit2,
  Trash2,
  UserPlus,
} from "lucide-react";

export function ProjectCard({ project, onEdit, onDelete, onView, onManageMembers }) {
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

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline(project.deadline);

  return (
    <Card hoverable className="cursor-pointer transition-all" onClick={onView}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
              <FolderOpen
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white truncate">
                {project.name}
              </h3>
              <Badge
                variant={getStatusColor(project.status)}
                size="sm"
                className="mt-2"
              >
                {project.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700"></div>

        {/* Info Row 1: Deadline */}
        {project.deadline && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar
              size={16}
              className="text-gray-500 dark:text-gray-400 flex-shrink-0"
            />
            <span className="text-gray-600 dark:text-gray-400">
              {formatDate(project.deadline)}
            </span>
            {daysLeft !== null && (
              <span
                className={`text-xs font-medium ml-auto ${
                  daysLeft <= 1
                    ? "text-error"
                    : daysLeft <= 3
                      ? "text-warning"
                      : "text-success"
                }`}
              >
                {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
              </span>
            )}
          </div>
        )}

        {/* Info Row 2: Members */}
        <div className="flex items-center gap-2 text-sm">
          <Users
            size={16}
            className="text-gray-500 dark:text-gray-400 flex-shrink-0"
          />
          <span className="text-gray-600 dark:text-gray-400">
            {project.members?.length || 0} member
            {project.members?.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700"></div>

        {/* Actions */}
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(project)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            onClick={() => onManageMembers(project)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <Users size={16} />
            Add Members
          </button>
          <button
            onClick={() => onDelete(project._id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg transition text-sm font-medium text-error"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </Card>
  );
}
