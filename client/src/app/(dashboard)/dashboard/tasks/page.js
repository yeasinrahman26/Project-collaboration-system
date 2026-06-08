"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTasks } from "@/lib/hooks";
import { useAuth } from "@/lib/hooks";
import { useModal } from "@/lib/hooks";
import { setCurrentTask, setFilters } from "@/lib/redux/slices/tasksSlice";
import { KanbanBoard, TaskFilters, TaskList } from "@/components/Tasks";
import { TaskModal } from "@/components/Tasks/TaskModal";
import { Modal } from "@/components/Common/Modal";
import { Button } from "@/components/Common/Button";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function TasksPage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { deleteTask } = useTasks();
  const { open: openTaskModal } = useModal("taskModal");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    taskId: null,
    taskTitle: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Set filter based on role
  useEffect(() => {
    if (user && user.role === "TeamMember") {
      dispatch(setFilters({ myTasks: true }));
    } else {
      dispatch(setFilters({ myTasks: false }));
    }
  }, [user, dispatch]);

  const handleCreateTask = () => {
    dispatch(setCurrentTask(null));
    openTaskModal();
  };

  const handleEditTask = (task) => {
    dispatch(setCurrentTask(task));
    openTaskModal();
  };

  const handleDeleteClick = (taskId, taskTitle) => {
    setDeleteModal({ open: true, taskId, taskTitle });
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTask(deleteModal.taskId);
      toast.success("Task deleted successfully!");
      setDeleteModal({ open: false, taskId: null, taskTitle: null });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  const isAdminOrPM = user?.role === "Admin" || user?.role === "ProjectManager";
  const isTeamMember = user?.role === "TeamMember";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {isTeamMember ? "My Tasks" : "All Tasks"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isTeamMember
              ? "Track your assigned tasks and update their status"
              : "Manage all project tasks"}
          </p>
        </div>
        {isAdminOrPM && (
          <Link href="/dashboard/addTask">
            <Button variant="primary" className="flex items-center gap-2">
              <Plus size={20} />
              New Task
            </Button>
          </Link>
        )}
      </div>

      {/* For Admin/ProjectManager - Show Table with Filters */}
      {isAdminOrPM && (
        <>
          {/* Filters */}
          <TaskFilters />

          {/* Task List with Pagination */}
          <TaskList
            onEdit={handleEditTask}
            onDelete={(taskId, taskTitle) =>
              handleDeleteClick(taskId, taskTitle)
            }
          />

          {/* Task Modal */}
          <TaskModal />
        </>
      )}

      {/* For TeamMembers - Show Kanban Board */}
      {isTeamMember && (
        <>
          {/* Kanban Board */}
          <KanbanBoard
            onEdit={handleEditTask}
            onDelete={(taskId, taskTitle) =>
              handleDeleteClick(taskId, taskTitle)
            }
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() =>
          setDeleteModal({ open: false, taskId: null, taskTitle: null })
        }
        title="Confirm Delete"
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{deleteModal.taskTitle}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() =>
                setDeleteModal({ open: false, taskId: null, taskTitle: null })
              }
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Task"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
