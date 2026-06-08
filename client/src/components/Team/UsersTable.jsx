"use client";

import { useState } from "react";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/lib/redux/services/authApi";
import { useAuth } from "@/lib/hooks/useAuth";
import { Loading, Modal, Toast } from "../Common";
import Image from "next/image";

const UsersTable = () => {
  const { user: currentUser } = useAuth();
  const { data, isLoading, error } = useGetAllUsersQuery();
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteUserMutation] = useDeleteUserMutation();

  const [selectedRole, setSelectedRole] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, userId: null });
  const [toast, setToast] = useState(null);

  const users = data?.users || [];
  const isAdmin = currentUser?.role === "Admin";

  if (!isAdmin) {
    return <div className="p-6 text-red-500">Access Denied: Admin only</div>;
  }

  if (isLoading) return <Loading />;
  if (error) return <div className="p-6 text-red-500">Error loading users</div>;

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateRole({ userId, role: newRole }).unwrap();
      setToast({ type: "success", message: "Role updated successfully" });
      setSelectedRole((prev) => ({ ...prev, [userId]: newRole }));
    } catch (err) {
      setToast({ type: "error", message: "Failed to update role" });
    }
  };

  const handleDeleteClick = (userId) => {
    setDeleteModal({ open: true, userId });
  };

  const confirmDelete = async () => {
    try {
      await deleteUserMutation(deleteModal.userId).unwrap();
      setToast({ type: "success", message: "User deleted successfully" });
      setDeleteModal({ open: false, userId: null });
    } catch (err) {
      setToast({ type: "error", message: "Failed to delete user" });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        User Management
      </h2>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold dark:text-white">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold dark:text-white">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold dark:text-white">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold dark:text-white">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {user.profilePicture && (
                      <Image
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="dark:text-white font-medium">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={selectedRole[user._id] || user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="px-3 py-2 bg-blue-50 dark:bg-gray-700 border border-blue-200 dark:border-gray-600 rounded text-sm dark:text-white cursor-pointer"
                  >
                    <option value="TeamMember">Team Member</option>
                    <option value="ProjectManager">Project Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteClick(user._id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition"
                    disabled={user._id === currentUser.id}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, userId: null })}
        title="Confirm Delete"
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setDeleteModal({ open: false, userId: null })}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Delete User
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default UsersTable;
