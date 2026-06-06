"use client";

import { useEffect, useState } from "react";
import { useProjects } from "@/lib/hooks";
import { MemberCard } from "./MemberCard";
import { Button } from "@/components/Common/Button";
import { Card } from "@/components/Common/Card";
import { Users, Plus } from "lucide-react";
import { SkeletonLoader } from "@/components/Common/Loading";

export function TeamMembers({ projectId, onAddMember, canManage = false }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { projects } = useProjects();

  useEffect(() => {
    const currentProject = projects.find((p) => p._id === projectId);
    if (currentProject) {
      setMembers(currentProject.members || []);
      setLoading(false);
    }
  }, [projectId, projects]);

  if (loading) return <SkeletonLoader />;

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-primary" />
          <h3 className="font-bold text-gray-900 dark:text-white">
            Team Members ({members.length})
          </h3>
        </div>
        {canManage && (
          <Button
            variant="primary"
            size="sm"
            onClick={onAddMember}
            className="flex items-center gap-1"
          >
            <Plus size={16} />
            Add
          </Button>
        )}
      </div>

      {members.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No team members yet
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <MemberCard
              key={member._id}
              member={member}
              isRemovable={canManage}
              onRemove={onAddMember} // TODO: Should be onRemoveMember
            />
          ))}
        </div>
      )}
    </Card>
  );
}
