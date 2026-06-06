"use client";

import { useState, useEffect } from "react";
import { useProjects } from "@/lib/hooks";
import { useModal } from "@/lib/hooks";
import { Modal } from "@/components/Common/Modal";
import { Button } from "@/components/Common/Button";
import { MemberCard } from "./MemberCard";
import api from "@/lib/utils/api";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

export function AddMemberModal() {
  const { isOpen, close } = useModal("addMemberModal");
  const { addMemberToProject } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchMembers();
    } else {
      setMembers([]);
    }
  }, [searchQuery]);

  const searchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/search/members?query=${searchQuery}`);
      setMembers(response.data);
    } catch (error) {
      console.error("Failed to search members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMember = (member) => {
    if (selectedMembers.find((m) => m._id === member._id)) {
      setSelectedMembers(selectedMembers.filter((m) => m._id !== member._id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleAddMembers = async () => {
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    try {
      setLoading(true);
      for (const member of selectedMembers) {
        // TODO: Get projectId from parent component
        // await addMemberToProject(projectId, member._id);
      }
      toast.success("Members added successfully!");
      close();
      setSelectedMembers([]);
      setSearchQuery("");
    } catch (error) {
      toast.error("Failed to add members");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        close();
        setSelectedMembers([]);
        setSearchQuery("");
      }}
      title="Add Team Members"
      size="lg"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={() => {
              close();
              setSelectedMembers([]);
              setSearchQuery("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddMembers}
            loading={loading}
            disabled={selectedMembers.length === 0}
          >
            Add{" "}
            {selectedMembers.length > 0 ? `(${selectedMembers.length})` : ""}{" "}
            Members
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search members by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white"
          />
        </div>

        {/* Results */}
        <div>
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Searching...
            </p>
          ) : members.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              {searchQuery
                ? "No members found"
                : "Start typing to search members"}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => (
                <div
                  key={member._id}
                  onClick={() => handleSelectMember(member)}
                  className={`cursor-pointer p-4 border-2 rounded-lg transition ${
                    selectedMembers.find((m) => m._id === member._id)
                      ? "border-primary bg-blue-50 dark:bg-blue-900"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {member.profilePicture ? (
                      <img
                        src={member.profilePicture}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Count */}
        {selectedMembers.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {selectedMembers.length} member
              {selectedMembers.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
