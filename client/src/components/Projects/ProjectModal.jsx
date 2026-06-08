"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { clearSelectedProject } from "@/lib/redux/slices/projectsSlice";
import { useProjects } from "@/lib/hooks";
import { useModal } from "@/lib/hooks";
import { Modal } from "@/components/Common/Modal";
import { Button } from "@/components/Common/Button";
import { Input } from "@/components/Common/Input";
import toast from "react-hot-toast";
import { Calendar } from "lucide-react";

export function ProjectModal() {
  const dispatch = useDispatch();
  const { isOpen, close } = useModal("projectModal");
  const { createProject, updateProject } = useProjects();


  const currentProject = useSelector((state) => state.projects.currentProject);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      deadline: "",
      status: "Active",
    },
  });

  
  useEffect(() => {
    if (isOpen && currentProject) {
    
      reset({
        name: currentProject.name || "",
        description: currentProject.description || "",
        deadline: currentProject.deadline
          ? currentProject.deadline.split("T")[0]
          : "", // Format date for input
        status: currentProject.status || "Active",
      });
    } else if (isOpen && !currentProject) {
     
      reset({
        name: "",
        description: "",
        deadline: "",
        status: "Active",
      });
    }
  }, [isOpen, currentProject, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (currentProject) {
       
        await updateProject(currentProject._id, data);
        toast.success("Project updated successfully!");
      } else {
       
        await createProject(data);
        toast.success("Project created successfully!");
      }

      reset();
      handleClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    close();
   
    dispatch(clearSelectedProject());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={currentProject ? "Edit Project" : "Create New Project"}
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
            {currentProject ? "Update Project" : "Create Project"}
          </Button>
        </>
      }
    >
      <form className="space-y-6">
        {/* Project Name */}
        <Input
          label="Project Name"
          placeholder="e.g., Website Redesign"
          {...register("name", {
            required: "Project name is required",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters",
            },
          })}
          error={errors.name?.message}
        />

        {/* Description */}
        <div>
          <label className="form-label">Description</label>
          <textarea
            placeholder="Describe your project..."
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

        {/* Project Status */}
        <div>
          <label className="form-label">Project Status</label>
          <select
            className="input-field"
            {...register("status", {
              required: "Status is required",
            })}
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
          {errors.status && (
            <p className="error-message">{errors.status.message}</p>
          )}
        </div>

        {/* Deadline */}
        <Input
          label="Deadline"
          type="date"
          icon={Calendar}
          {...register("deadline", {
            validate: (value) => {
              if (!value) return true;
              const selectedDate = new Date(value);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return selectedDate >= today || "Deadline cannot be in the past";
            },
          })}
          error={errors.deadline?.message}
        />
      </form>
    </Modal>
  );
}
