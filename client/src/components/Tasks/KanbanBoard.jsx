"use client";

import { useState } from "react";
import { useTasks } from "@/lib/hooks";
import { TaskColumn } from "./TaskColumn";
import { TASK_STATUS } from "@/lib/utils/constants";
import { SkeletonLoader } from "@/components/Common/Loading";
import toast from "react-hot-toast";

export function KanbanBoard({ onEdit, onDelete }) {
  const { tasks, isLoading, changeTaskStatus } = useTasks();
  const [draggedTask, setDraggedTask] = useState(null);

  if (isLoading) return <SkeletonLoader />;

  const organizeTasksByStatus = () => {
    return {
      [TASK_STATUS.TODO]: tasks.filter((t) => t.status === TASK_STATUS.TODO),
      [TASK_STATUS.IN_PROGRESS]: tasks.filter(
        (t) => t.status === TASK_STATUS.IN_PROGRESS,
      ),
      [TASK_STATUS.COMPLETED]: tasks.filter(
        (t) => t.status === TASK_STATUS.COMPLETED,
      ),
    };
  };

  const tasksByStatus = organizeTasksByStatus();

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = async (newStatus) => {
    if (!draggedTask) return;

    if (draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      await changeTaskStatus(draggedTask._id, newStatus);
      toast.success(`Task moved to ${newStatus}`);
      setDraggedTask(null);
    } catch (error) {
      toast.error("Failed to move task");
      setDraggedTask(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.values(TASK_STATUS).map((status) => (
        <div
          key={status}
          onDragStart={(e) => {
            if (draggedTask) {
              e.dataTransfer.effectAllowed = "move";
            }
          }}
          onDragEnd={handleDragEnd}
        >
          <TaskColumn
            status={status}
            tasks={tasksByStatus[status] || []}
            onEdit={onEdit}
            onDelete={onDelete}
            onDrop={() => handleDrop(status)}
            onDragOver={() => {}}
          />
        </div>
      ))}
    </div>
  );
}
