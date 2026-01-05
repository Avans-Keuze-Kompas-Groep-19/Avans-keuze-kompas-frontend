"use client";

import React, { useEffect, useState } from "react";
import { getApiClient } from "@/app/lib/apiClient";
import type { User, PartialUserWithPartialProfile } from "@/app/types/User";
import type { ApiError } from "@/app/lib/apiClient";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiClient = getApiClient();
        const fetchedUsers = await apiClient.getUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = async (
    updatedUser: PartialUserWithPartialProfile
  ) => {
    if (!selectedUser) return;

    try {
      const apiClient = getApiClient();
      const savedUser = await apiClient.updateUser(
        selectedUser._id,
        updatedUser
      );
      setUsers(
        users.map((user) => (user._id === savedUser._id ? savedUser : user))
      );
      handleCloseEditModal();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const apiClient = getApiClient();
      await apiClient.deleteUser(userToDelete._id);
      setUsers(users.filter((user) => user._id !== userToDelete._id));
      handleCloseDeleteModal();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user._id} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{`${user.profile.first_name} ${user.profile.last_name}`}</h2>
            <p className="text-gray-600">
              {user.email} - {user.group}
            </p>
            <p className="text-gray-600">
              Type Gebruiker:
              {user.is_admin ? "Admin rechtem" : "Gebruiker"} -{" "}
              {user.is_student ? "Student" : "Medewerker"}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEditClick(user)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(user)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {isEditModalOpen && (
        <EditUserModal
          user={selectedUser}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdateUser}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteUserModal
          user={userToDelete}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default UserList;
