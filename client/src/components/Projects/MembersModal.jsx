"use client";

import { useState, useCallback, useEffect } from "react"; // ✅ Add useEffect
import { useDispatch, useSelector } from "react-redux";
import {
  useGetProjectByIdQuery,
  useAddMemberMutation,
  useRemoveMemberMutation,
} from "@/lib/redux/services/projectsApi";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Modal } from "@/components/Common/Modal";
import { Input } from "@/components/Common/Input";
import { Button } from "@/components/Common/Button";
import { Search, Crown, User, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchMembersQuery } from "@/lib/redux/services/searchApi";

export function MembersModal({ isOpen, onClose }) {
  const dispatch = useDispatch();

  const reduxProject = useSelector((state) => state.projects.currentProject);
  const projectId = reduxProject?._id;

  const { data: freshProject, isLoading: isProjectLoading } =
    useGetProjectByIdQuery(projectId, { skip: !projectId || !isOpen });

  const project = freshProject || reduxProject;

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  // ✅ NEW: Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const { data: searchResults = [], isFetching: isSearching } =
    useSearchMembersQuery(debouncedQuery, {
      skip: !debouncedQuery || debouncedQuery.length < 2,
    });

  const [addMember, { isLoading: isAdding }] = useAddMemberMutation();
  const [removeMember, { isLoading: isRemoving }] = useRemoveMemberMutation();

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);


 const handleAddMember = useCallback(
   async (memberId) => {
     if (!projectId) {
       toast.error("Project not found");
       return;
     }

     try {
       await addMember({
         projectId,
         memberId,
       }).unwrap();

       toast.success("Member added successfully!");
       setSearchQuery("");
     } catch (error) {
       console.error("Add member error:", error);
       toast.error(error?.data?.message || "Failed to add member");
     }
   },
   [addMember, projectId],
 );

  const handleRemoveMember = useCallback(
    async (memberId) => {
      if (!projectId) {
        toast.error("Project not found");
        return;
      }

      if (!confirm("Remove this member from the project?")) return;

      try {
        await removeMember({
          projectId,
          memberId,
        }).unwrap();

        toast.success("Member removed successfully!");
      } catch (error) {
        console.error("Remove member error:", error);
        toast.error(error?.data?.message || "Failed to remove member");
      }
    },
    [removeMember, projectId],
  );

  if (!project) return null;

  const currentMemberIds = new Set(project.members?.map((m) => m._id) || []);
  const filteredResults = searchResults.filter(
    (result) => !currentMemberIds.has(result._id),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Team Members - ${project.name}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Loading indicator */}
        {isProjectLoading && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Loader size={16} className="animate-spin" />
            Syncing members...
          </div>
        )}

        {/* Search Section */}
        <div>
          <h3 className="font-medium mb-2">Search & Add Members</h3>
          <div className="relative">
            <Input
              placeholder="Search by name or email..."
              icon={Search}
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={isSearching}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader size={18} className="animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        {debouncedQuery && (
          <div>
            <h3 className="font-medium mb-3">
              {isSearching
                ? "Searching..."
                : `Search Results (${filteredResults.length})`}
            </h3>

            {filteredResults.length > 0 ? (
              <div className="space-y-2 border rounded-lg p-3 bg-gray-50 dark:bg-gray-900 max-h-64 overflow-y-auto">
                {filteredResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <User
                          size={16}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleAddMember(user._id)}
                      disabled={isAdding}
                      className="ml-2 flex-shrink-0"
                    >
                      {isAdding ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : !isSearching ? (
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">No users found</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Current Members */}
        <div>
          <h3 className="font-medium mb-3">
            Current Members ({project.members?.length || 0})
          </h3>

          {project.members && project.members.length > 0 ? (
            <div className="space-y-2 border rounded-lg p-3 bg-gray-50 dark:bg-gray-900 max-h-64 overflow-y-auto">
              {project.members.map((member) => {
                const isOwner = member._id === project.createdBy?._id;

                return (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {isOwner ? (
                        <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center flex-shrink-0">
                          <Crown
                            size={16}
                            className="text-yellow-600 dark:text-yellow-400"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <User
                            size={16}
                            className="text-gray-600 dark:text-gray-400"
                          />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    {isOwner ? (
                      <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 ml-2 flex-shrink-0 px-2 py-1 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                        Owner
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleRemoveMember(member._id)}
                        disabled={isRemoving}
                        className="ml-2 flex-shrink-0"
                      >
                        {isRemoving ? (
                          <Loader size={14} className="animate-spin" />
                        ) : (
                          "Remove"
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-500">No members yet</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
