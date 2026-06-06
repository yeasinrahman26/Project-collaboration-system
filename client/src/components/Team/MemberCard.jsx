"use client";

import { getInitials } from "@/lib/utils/formatters";
import { Badge } from "@/components/Common/Badge";
import { Card } from "@/components/Common/Card";
import { User, Trash2 } from "lucide-react";

export function MemberCard({ member, onRemove, isRemovable = false }) {
  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "error";
      case "ProjectManager":
        return "warning";
      case "TeamMember":
        return "success";
      default:
        return "primary";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "ProjectManager":
        return "Project Manager";
      case "TeamMember":
        return "Team Member";
      default:
        return role;
    }
  };

  return (
    <Card className="hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        {/* Avatar & Name */}
        <div className="flex items-center gap-3 flex-1">
          {member.profilePicture ? (
            <img
              src={member.profilePicture}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {getInitials(member.name)}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {member.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {member.email}
            </p>
          </div>
        </div>

        {/* Remove Button */}
        {isRemovable && (
          <button
            onClick={() => onRemove(member._id)}
            className="ml-2 p-2 text-error hover:bg-red-100 dark:hover:bg-red-900 rounded transition flex-shrink-0"
            title="Remove member"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 mb-4"></div>

      {/* Role Badge */}
      <div className="flex items-center justify-between">
        <Badge variant={getRoleColor(member.role)} size="sm">
          {getRoleLabel(member.role)}
        </Badge>
        <User size={16} className="text-gray-400" />
      </div>
    </Card>
  );
}
