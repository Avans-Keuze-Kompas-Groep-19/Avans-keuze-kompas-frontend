"use client";

import React, { useEffect, useState } from "react";
import { getApiClient } from "@/app/lib/apiClient";
import type { User, PartialUserWithPartialProfile } from "@/app/types/User";
import type { ApiError } from "@/app/lib/apiClient";
import { useAuth } from "@/app/lib/auth/useAuth";
import LoginForm from "@/app/Components/Auth/loginForm";
import { Header } from "@/app/Components/layout/header/Header";
import UserList from "@/app/Components/Users/UserList";
import CreateUserModal from "@/app/Components/Users/CreateUserModal";
import EditUserModal from "@/app/Components/Users/EditUserModal";
import DeleteUserModal from "@/app/Components/Users/DeleteUserModal";
import HeroSection from "../Components/layout/Hero/Hero";

const UsersPage = () => {
  const { isLoggedIn } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUsers = async () => {
        try {
          setLoading(true);
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
    }
  }, [isLoggedIn]);

  const handleCreateUser = async (newUser: PartialUserWithPartialProfile) => {
    try {
      const apiClient = getApiClient();
      const createdUser = await apiClient.createUser(newUser);
      setUsers([...users, createdUser]);
      setIsCreateModalOpen(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    }
  };

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

  return (
    <>
      <Header />

      <main className="p-6 max-w-4xl mx-auto">
        <HeroSection
          heading="Bewerk hier de gebruikers!"
          description=""
          imageSrc="/hero.png"
          imageAlt="Hero image"
          background="#c6002a"
        />
        {isLoggedIn ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Users Dashboard</h1>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Create User
              </button>
            </div>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">Error: {error}</div>}
            {!loading && !error && (
              <UserList
                users={users}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            )}
          </>
        ) : (
          <LoginForm />
        )}
      </main>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateUser}
      />

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

export default UsersPage;
