"use client";

import { ProjectCard } from "./ProjectCard";
import { SkeletonLoader } from "@/components/Common/Loading";

export function ProjectsGrid({
  projects,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onManageMembers,
}) {
  if (isLoading) return <SkeletonLoader />;

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
          No projects found
        </p>
        <p className="text-gray-400 dark:text-gray-500">
          Create a new project to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={() => onView(project)}
          onManageMembers={() => onManageMembers(project)}
        />
      ))}
    </div>
  );
}
