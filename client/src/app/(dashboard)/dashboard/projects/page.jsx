"use client";

import { useState } from "react";
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
import { Modal } from "@/components/Common/Modal";
import { Button } from "@/components/Common/Button";
import { RouteGuard } from "@/components/Common";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { Pagination } from "@/components/Common/pagination";

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const { projects, isLoading, deleteProject, pagination, setPage } =
    useProjects();

  const currentProject = useSelector((state) => state.projects.currentProject);

  const { open: openProjectModal } = useModal("projectModal");
  const {
    open: openMembersModal,
    isOpen: isMembersModalOpen,
    close: closeMembersModal,
  } = useModal("membersModal");

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    projectId: null,
    projectName: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = (projectId, projectName) => {
    setDeleteModal({ open: true, projectId, projectName });
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteProject(deleteModal.projectId);
      toast.success("Project deleted successfully!");
      setDeleteModal({ open: false, projectId: null, projectName: null });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewProject = (project) => {
    console.log("View project:", project);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <RouteGuard requiredRoles={["Admin", "ProjectManager"]}>
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
          onDelete={(projectId, projectName) =>
            handleDeleteClick(projectId, projectName)
          }
          onView={handleViewProject}
          onManageMembers={handleManageMembers}
        />

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.open}
          onClose={() =>
            setDeleteModal({ open: false, projectId: null, projectName: null })
          }
          title="Confirm Delete"
        >
          <div className="p-4">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteModal.projectName}</span>
              ? All associated tasks will also be deleted. This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setDeleteModal({
                    open: false,
                    projectId: null,
                    projectName: null,
                  })
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
                {isDeleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </Modal>

        {/* Modals */}
        <ProjectModal />
        <MembersModal
          isOpen={isMembersModalOpen}
          onClose={handleCloseMembersModal}
        />
      </div>
    </RouteGuard>
  );
}
