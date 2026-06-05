"use client";

import { useDispatch } from "react-redux";
import { useTasks } from "@/lib/hooks";
import { useModal } from "@/lib/hooks";
import { openModal } from "@/lib/redux/slices/uiSlice";
import { KanbanBoard, TaskFilters, TaskModal } from "@/components/Tasks";
import { Button } from "@/components/Common/Button";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

export default function TasksPage() {
  const dispatch = useDispatch();
  const { deleteTask } = useTasks();
  const { open: openTaskModal } = useModal("taskModal");

  const handleCreateTask = () => {
    openTaskModal();
  };

  const handleEditTask = (task) => {
    // TODO: Set editing task and open modal
    openTaskModal();
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        toast.success("Task deleted successfully!");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete task");
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your tasks and track progress
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreateTask}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <TaskFilters />

      {/* Kanban Board */}
      <KanbanBoard onEdit={handleEditTask} onDelete={handleDeleteTask} />

      {/* Task Modal */}
      <TaskModal />
    </div>
  );
}
