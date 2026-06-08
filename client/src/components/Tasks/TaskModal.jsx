"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useTasks, useProjects } from "@/lib/hooks";
import { useModal } from "@/lib/hooks";
import { Modal } from "@/components/Common/Modal";
import { Button } from "@/components/Common/Button";
import { Input } from "@/components/Common/Input";
import { TASK_PRIORITY, TASK_STATUS } from "@/lib/utils/constants";
import toast from "react-hot-toast";
import { Calendar, Users } from "lucide-react";

export function TaskModal() {
  const { isOpen, close } = useModal("taskModal");
  const { createTask, updateTask } = useTasks();
  const { projects } = useProjects();
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);

  const currentTask = useSelector((state) => state.tasks.currentTask);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      projectId: "",
      assignedTo: "",
      priority: TASK_PRIORITY.MEDIUM,
      dueDate: "",
    },
  });

  const projectIdValue = watch("projectId");

  // Update project members when project is selected
  useEffect(() => {
    if (projectIdValue) {
      const project = projects.find((p) => p._id === projectIdValue);
      if (project) {
        setSelectedProject(project);
        setProjectMembers(project.members || []);
      }
    } else {
      setProjectMembers([]);
      setSelectedProject(null);
    }
  }, [projectIdValue, projects]);

  useEffect(() => {
    if (isOpen) {
      if (currentTask) {
        reset({
          title: currentTask.title || "",
          description: currentTask.description || "",
          projectId: currentTask.projectId?._id || currentTask.projectId || "",
          assignedTo:
            currentTask.assignedTo?._id || currentTask.assignedTo || "",
          priority: currentTask.priority || TASK_PRIORITY.MEDIUM,
          dueDate: currentTask.dueDate
            ? new Date(currentTask.dueDate).toISOString().split("T")[0]
            : "",
        });
        // Set members for edit mode
        if (currentTask.projectId) {
          const project = projects.find(
            (p) => p._id === currentTask.projectId._id,
          );
          if (project) {
            setSelectedProject(project);
            setProjectMembers(project.members || []);
          }
        }
      } else {
        reset({
          title: "",
          description: "",
          projectId: "",
          assignedTo: "",
          priority: TASK_PRIORITY.MEDIUM,
          dueDate: "",
        });
        setProjectMembers([]);
      }
    }
  }, [isOpen, currentTask, reset, projects]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (currentTask) {
        await updateTask(currentTask._id, data);
        toast.success("Task updated successfully!");
      } else {
        await createTask(data);
        toast.success("Task created successfully!");
      }

      reset();
      close();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={currentTask ? "Edit Task" : "Create New Task"}
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
            {currentTask ? "Update" : "Create"}
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
          <label className="form-label">Project *</label>
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

        {/* Assign Member (Dynamic based on project) */}
        {projectMembers.length > 0 && (
          <div>
            <label className="form-label flex items-center gap-2">
              <Users size={16} />
              Assign Member
            </label>
            <select className="input-field" {...register("assignedTo")}>
              <option value="">Select a member</option>
              {projectMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>
        )}

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
