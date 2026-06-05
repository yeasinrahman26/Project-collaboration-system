"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks, useProjects } from "@/lib/hooks";
import { useModal } from "@/lib/hooks";
import { Modal } from "@/components/Common/Modal";
import { Button } from "@/components/Common/Button";
import { Input } from "@/components/Common/Input";
import { TASK_PRIORITY, TASK_STATUS } from "@/lib/utils/constants";
import toast from "react-hot-toast";
import { Calendar, AlertCircle } from "lucide-react";

export function TaskModal() {
  const { isOpen, close } = useModal("taskModal");
  const { createTask, updateTask } = useTasks();
  const { projects } = useProjects();
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      projectId: "",
      priority: TASK_PRIORITY.MEDIUM,
      dueDate: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (editingTask) {
        await updateTask(editingTask._id, data);
        toast.success("Task updated successfully!");
      } else {
        await createTask(data);
        toast.success("Task created successfully!");
      }

      reset();
      close();
      setEditingTask(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setEditingTask(null);
    close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingTask ? "Edit Task" : "Create New Task"}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            loading={loading}
          >
            {editingTask ? "Update" : "Create"}
          </Button>
        </>
      }
    >
      <form className="space-y-6">
        {/* Task Title */}
        <Input
          label="Task Title"
          placeholder="e.g., Setup database"
          {...register("title", {
            required: "Task title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
          })}
          error={errors.title?.message}
        />

        {/* Description */}
        <div>
          <label className="form-label">Description</label>
          <textarea
            placeholder="Describe the task..."
            rows="3"
            className="input-field resize-none"
            {...register("description", {
              maxLength: {
                value: 500,
                message: "Description must be less than 500 characters",
              },
            })}
          />
          {errors.description && (
            <p className="error-message">{errors.description.message}</p>
          )}
        </div>

        {/* Project */}
        <div>
          <label className="form-label">Project</label>
          <select
            className="input-field"
            {...register("projectId", {
              required: "Project is required",
            })}
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <p className="error-message">{errors.projectId.message}</p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="form-label">Priority</label>
          <select className="input-field" {...register("priority")}>
            {Object.values(TASK_PRIORITY).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <Input
          label="Due Date"
          type="date"
          icon={Calendar}
          {...register("dueDate", {
            validate: (value) => {
              if (!value) return true;
              const selectedDate = new Date(value);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return selectedDate >= today || "Due date cannot be in the past";
            },
          })}
          error={errors.dueDate?.message}
        />
      </form>
    </Modal>
  );
}
