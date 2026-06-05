"use client";

import { TaskCard } from "./TaskCard";
import { TASK_STATUS } from "@/lib/utils/constants";
import { CheckCircle, Clock, ListTodo } from "lucide-react";

export function TaskColumn({
  status,
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onDrop,
  onDragOver,
}) {
  const getColumnHeader = (status) => {
    switch (status) {
      case TASK_STATUS.TODO:
        return { label: "To Do", icon: ListTodo, color: "text-gray-600" };
      case TASK_STATUS.IN_PROGRESS:
        return { label: "In Progress", icon: Clock, color: "text-blue-600" };
      case TASK_STATUS.COMPLETED:
        return {
          label: "Completed",
          icon: CheckCircle,
          color: "text-green-600",
        };
      default:
        return { label: status, icon: ListTodo, color: "text-gray-600" };
    }
  };

  const header = getColumnHeader(status);
  const Icon = header.icon;

  return (
    <div
      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col min-h-[500px]"
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(status);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.(status);
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <Icon size={20} className={header.color} />
        <h3 className="font-bold text-gray-900 dark:text-white">
          {header.label}
        </h3>
        <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No tasks yet</p>
            <p className="text-xs">Drag tasks here to move them</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
