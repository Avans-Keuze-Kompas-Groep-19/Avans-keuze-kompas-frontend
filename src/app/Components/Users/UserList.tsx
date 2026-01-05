"use client";

import React, { useEffect, useState } from "react";
import { getApiClient } from "@/app/lib/apiClient";
import type { User, PartialUserWithPartialProfile } from "@/app/types/User";
import type { ApiError } from "@/app/lib/apiClient";
import EditUserModal from "./EditUserModal";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      handleCloseModal();
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
          <div key={user._id} className="p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{`${user.profile.first_name} ${user.profile.last_name}`}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.group}</p>
            <p className="text-gray-600">
              {user.is_student ? "Student" : "Avans Medewerker"}
            </p>
            <p className="text-gray-600">
              {user.is_admin ? "Admin Gebruiker" : "Gebruiker"}
            </p>
            <div className="mt-4">
              <button
                onClick={() => handleEditClick(user)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <EditUserModal
          user={selectedUser}
          onClose={handleCloseModal}
          onUpdate={handleUpdateUser}
        />
      )}
    </>
  );
};

export default UserList;
