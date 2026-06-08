"use client";

import { useDispatch, useSelector } from "react-redux";
import { setCurrentProject } from "@/lib/redux/slices/projectsSlice";
import { useProjects } from "@/lib/hooks";
import { useModal } from "@/lib/hooks";
import {
  ProjectsGrid,
  ProjectFilters,
  ProjectModal,
  MembersModal,
} from "@/components/Projects";
import { Button } from "@/components/Common/Button";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { Pagination } from "@/components/Common/pagination";

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const {
    projects,
    isLoading,
    deleteProject,
    pagination,
    setPage,
  } = useProjects();

  const currentProject = useSelector((state) => state.projects.currentProject);

  const { open: openProjectModal } = useModal("projectModal");
  const {
    open: openMembersModal,
    isOpen: isMembersModalOpen,
    close: closeMembersModal,
  } = useModal("membersModal");

  const handleCreateProject = () => {
    dispatch(setCurrentProject(null));
    openProjectModal();
  };

  const handleManageMembers = (project) => {
    dispatch(setCurrentProject(project));
    openMembersModal();
  };

  const handleCloseMembersModal = () => {
    closeMembersModal();
    setTimeout(() => {
      dispatch(setCurrentProject(null));
    }, 300);
  };

  const handleEditProject = (project) => {
    dispatch(setCurrentProject(project));
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
    console.log("View project:", project);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
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
        onManageMembers={handleManageMembers}
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />

      {/* Modals */}
      <ProjectModal />
      <MembersModal
        isOpen={isMembersModalOpen}
        onClose={handleCloseMembersModal}
      />
    </div>
  );
}
