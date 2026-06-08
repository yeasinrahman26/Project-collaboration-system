"use client";

import { useTasks } from "@/lib/hooks";
import { useAuth } from "@/lib/hooks";
import { useDispatch } from "react-redux";
import { setCurrentTask } from "@/lib/redux/slices/tasksSlice";
import { formatDate } from "@/lib/utils/formatters";
import { Badge } from "@/components/Common/Badge";
import { Button } from "@/components/Common/Button";
import { TASK_PRIORITY, PRIORITY_COLORS } from "@/lib/utils/constants";
import { Edit2, Trash2, Calendar, User } from "lucide-react";
import toast from "react-hot-toast";

export function TaskList({ onEdit, onDelete }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { tasks, isLoading, pagination, setFilters } = useTasks();

  if (isLoading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

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

  const isOverdue = (dueDate, status) => {
    return dueDate && new Date(dueDate) < new Date() && status !== "Completed";
  };

  const handlePageChange = (newPage) => {
    setFilters({ page: newPage });
  };

  return (
    <div className="space-y-4">
      {/* Tasks Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold dark:text-white">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold dark:text-white">
                Project
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold dark:text-white">
                Assigned To
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold dark:text-white">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold dark:text-white">
                Due Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold dark:text-white">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task._id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  {/* Title */}
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs hover:text-primary cursor-pointer">
                      {task.title}
                    </p>
                  </td>

                  {/* Project */}
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                    {task.projectId?.name || "N/A"}
                  </td>

                  {/* Assigned To */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {task.assignedTo?.profilePicture && (
                        <img
                          src={task.assignedTo.profilePicture}
                          alt={task.assignedTo.name}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {task.assignedTo?.name || "Unassigned"}
                      </span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="px-6 py-4">
                    <Badge variant={getPriorityColor(task.priority)} size="sm">
                      {task.priority}
                    </Badge>
                  </td>

                  {/* Due Date */}
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm ${
                        isOverdue(task.dueDate, task.status)
                          ? "text-error font-medium"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {task.dueDate ? formatDate(task.dueDate) : "No deadline"}
                      {isOverdue(task.dueDate, task.status) && " (Overdue)"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === "Completed"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : task.status === "InProgress"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {task.status === "Todo"
                        ? "To Do"
                        : task.status === "InProgress"
                          ? "In Progress"
                          : "Completed"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(task)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition text-gray-600 dark:text-gray-400"
                        title="Edit task"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(task._id, task.title)} // Pass task title too
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded transition text-error"
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} tasks
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.pages }).map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    pagination.page === index + 1
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
