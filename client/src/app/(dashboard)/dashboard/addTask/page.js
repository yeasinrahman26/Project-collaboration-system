"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTasks, useProjects } from "@/lib/hooks";
import { Button } from "@/components/Common/Button";
import { Input } from "@/components/Common/Input";
import { TASK_PRIORITY } from "@/lib/utils/constants";
import toast from "react-hot-toast";
import { Calendar, Users, ArrowLeft } from "lucide-react";
import { RouteGuard } from "@/components/Common";

export default function CreateTaskPage() {
  const router = useRouter();
  const { createTask } = useTasks();
  const { projects } = useProjects();
  const [loading, setLoading] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
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

  // Update members when project changes
  const handleProjectChange = (projectId) => {
    if (projectId) {
      const project = projects.find((p) => p._id === projectId);
      if (project) {
        setProjectMembers(project.members || []);
      }
    } else {
      setProjectMembers([]);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await createTask(data);
      toast.success("Task created successfully!");
      reset();
      router.push("/dashboard/tasks");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteGuard requiredRoles={["Admin", "ProjectManager"]}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary-dark mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Task
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add a new task to your project
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Task Title */}
            <Input
              label="Task Title *"
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
                rows="4"
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
                  onChange: (e) => handleProjectChange(e.target.value),
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

            {/* Assign Member */}
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
                  return (
                    selectedDate >= today || "Due date cannot be in the past"
                  );
                },
              })}
              error={errors.dueDate?.message}
            />

            {/* Submit Button */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="flex-1"
              >
                Create Task
              </Button>
            </div>
          </form>
        </div>
      </div>
    </RouteGuard>
  );
}
