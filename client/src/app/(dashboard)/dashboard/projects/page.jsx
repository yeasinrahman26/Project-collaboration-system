"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useProjects } from "@/lib/hooks";
import { useModal } from "@/lib/hooks";
import { openModal } from "@/lib/redux/slices/uiSlice";
import {
  ProjectsGrid,
  ProjectFilters,
  ProjectModal,
} from "@/components/Projects";
import { Button } from "@/components/Common/Button";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const { projects, isLoading, deleteProject, pagination } = useProjects();
  const { open: openProjectModal } = useModal("projectModal");

  const handleCreateProject = () => {
    openProjectModal();
  };

  const handleEditProject = (project) => {
    // TODO: Set editing project and open modal
    openProjectModal();
  };

  const handleDeleteProject = async (projectId) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(projectId);
        toast.success("Project deleted successfully!");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete project");
      }
    }
  };

  const handleViewProject = (project) => {
    // TODO: Navigate to project detail page
    console.log("View project:", project);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all your projects and collaborate with your team
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreateProject}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <ProjectFilters />

      {/* Projects Grid */}
      <ProjectsGrid
        projects={projects}
        isLoading={isLoading}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
        onView={handleViewProject}
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {/* TODO: Add pagination controls */}
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal />
    </div>
  );
}
