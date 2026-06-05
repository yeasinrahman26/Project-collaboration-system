"use client";

import { useModal } from "@/lib/hooks";
import { Modal } from "@/components/Common/Modal";
import { TaskActions } from "./TaskActions";
import { Comments } from "./Comments";
import { ActivityLog } from "./ActivityLog";
import { useSelector } from "react-redux";

export function TaskDetailModal() {
  const { isOpen, close } = useModal("taskDetailModal");

  // Get current task from Redux state (you'll need to set this when opening modal)
  const currentTask = useSelector((state) => state.tasks.currentTask);

  if (!currentTask) return null;

  return (
    <Modal isOpen={isOpen} onClose={close} title="Task Details" size="2xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Task Actions */}
        <div className="lg:col-span-1">
          <TaskActions task={currentTask} onClose={close} />
        </div>

        {/* Right Column - Comments & Activity */}
        <div className="lg:col-span-2 space-y-8 border-l border-gray-200 dark:border-gray-700 pl-8">
          {/* Comments */}
          <Comments taskId={currentTask._id} />

          {/* Activity Log */}
          <ActivityLog taskId={currentTask._id} />
        </div>
      </div>
    </Modal>
  );
}
