"use client";

import { useDispatch } from "react-redux";
import { setCurrentTask } from "@/lib/redux/slices/tasksSlice";
import { openModal } from "@/lib/redux/slices/uiSlice";
import { formatDate } from "@/lib/utils/formatters";
import { Badge } from "@/components/Common/Badge";
import {
  TASK_PRIORITY,
  TASK_STATUS,
  PRIORITY_COLORS,
} from "@/lib/utils/constants";
import { Calendar, User, Edit2, Trash2 } from "lucide-react";

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isDragging,
}) {
  const dispatch = useDispatch();

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

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== TASK_STATUS.COMPLETED;

  const handleViewTask = (e) => {
    e.stopPropagation();
    dispatch(setCurrentTask(task));
    dispatch(openModal("taskDetailModal"));
  };

  return (
    <div
      draggable
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 cursor-move transition-all hover:shadow-md ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      style={{ borderLeftColor: PRIORITY_COLORS[task.priority] }}
      onClick={handleViewTask}
    >
      {/* Title */}
      <h4 className="font-medium text-gray-900 dark:text-white mb-2 truncate hover:text-primary transition">
        {task.title}
      </h4>

      {/* Priority Badge */}
      <div className="mb-3">
        <Badge variant={getPriorityColor(task.priority)} size="sm">
          {task.priority}
        </Badge>
      </div>

      {/* Project Name */}
      {task.projectId && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          {task.projectId?.name}
        </p>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div className="flex items-center gap-2 text-xs mb-3">
          <Calendar
            size={14}
            className={isOverdue ? "text-error" : "text-gray-500"}
          />
          <span
            className={
              isOverdue
                ? "text-error font-medium"
                : "text-gray-600 dark:text-gray-400"
            }
          >
            {formatDate(task.dueDate)}
            {isOverdue && " (Overdue)"}
          </span>
        </div>
      )}

      {/* Assigned User */}
      {task.assignedTo && (
        <div className="flex items-center gap-2 text-xs mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <User size={14} className="text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400">
            {task.assignedTo?.name}
          </span>
        </div>
      )}

      {/* Actions */}
      <div
        className="flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(task)}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition text-gray-700 dark:text-gray-300"
        >
          <Edit2 size={12} />
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 rounded transition text-error"
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </div>
  );
}
