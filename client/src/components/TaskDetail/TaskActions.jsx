"use client";

import { useState } from "react";
import { useTasks, useProjects } from "@/lib/hooks";
import { Button } from "@/components/Common/Button";
import { Badge } from "@/components/Common/Badge";
import { TASK_STATUS, TASK_PRIORITY } from "@/lib/utils/constants";
import { Calendar, AlertCircle, User, CheckCircle } from "lucide-react";
import { formatDate, formatRelativeTime } from "@/lib/utils/formatters";
import toast from "react-hot-toast";

export function TaskActions({ task, onClose }) {
  const { changeTaskStatus, assignTask, updateTask } = useTasks();
  const { projects } = useProjects();
  const [loading, setLoading] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case TASK_PRIORITY.HIGH:
        return "error";
      case TASK_PRIORITY.MEDIUM:
        return "warning";
      case TASK_PRIORITY.LOW:
        return "success";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TASK_STATUS.TODO:
        return "secondary";
      case TASK_STATUS.IN_PROGRESS:
        return "warning";
      case TASK_STATUS.COMPLETED:
        return "success";
      default:
        return "primary";
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      await changeTaskStatus(task._id, newStatus);
      toast.success(`Task moved to ${newStatus}`);
      onClose?.();
    } catch (error) {
      toast.error("Failed to update task status");
    } finally {
      setLoading(false);
    }
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== TASK_STATUS.COMPLETED;

  return (
    <div className="space-y-6">
      {/* Task Title & Status */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {task.title}
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={getStatusColor(task.status)}>{task.status}</Badge>
          <Badge variant={getPriorityColor(task.priority)}>
            {task.priority} Priority
          </Badge>
          {isOverdue && (
            <Badge variant="error" className="flex items-center gap-1">
              <AlertCircle size={14} />
              Overdue
            </Badge>
          )}
        </div>
      </div>

      {/* Task Description */}
      {task.description && (
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Description
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {task.description}
          </p>
        </div>
      )}

      {/* Task Details Grid */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        {/* Project */}
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Project
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {task.projectId?.name || "N/A"}
          </p>
        </div>

        {/* Due Date */}
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
            <Calendar size={14} />
            Due Date
          </p>
          <p
            className={`text-sm font-medium ${isOverdue ? "text-error" : "text-gray-900 dark:text-white"}`}
          >
            {task.dueDate ? formatDate(task.dueDate) : "Not set"}
          </p>
        </div>

        {/* Assigned To */}
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
            <User size={14} />
            Assigned To
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {task.assignedTo?.name || "Unassigned"}
          </p>
        </div>

        {/* Created */}
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Created
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatRelativeTime(task.createdAt)}
          </p>
        </div>
      </div>

      {/* Status Actions */}
      {task.status !== TASK_STATUS.COMPLETED && (
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            Update Status
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(TASK_STATUS).map((status) => (
              <Button
                key={status}
                onClick={() => handleStatusChange(status)}
                variant={task.status === status ? "primary" : "outline"}
                loading={loading}
                disabled={task.status === status}
                size="sm"
              >
                {status === TASK_STATUS.COMPLETED && <CheckCircle size={14} />}
                {status}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Complete Button (if not completed) */}
      {task.status !== TASK_STATUS.COMPLETED && (
        <Button
          onClick={() => handleStatusChange(TASK_STATUS.COMPLETED)}
          variant="success"
          className="w-full flex items-center justify-center gap-2"
          loading={loading}
        >
          <CheckCircle size={18} />
          Mark as Complete
        </Button>
      )}
    </div>
  );
}
