"use client";

import React, { useEffect, useState } from 'react';
import { getApiClient } from '@/app/lib/apiClient';
import type { User, PartialUserWithPartialProfile } from '@/app/types/User';
import type { ApiError } from '@/app/lib/apiClient';
import { useAuth } from "@/app/lib/auth/useAuth";
import LoginForm from "@/app/Components/Auth/loginForm";
import { Header } from "@/app/Components/layout/header/Header";
import UserList from "@/app/Components/Users/UserList";
import CreateUserModal from "@/app/Components/Users/CreateUserModal";
import EditUserModal from "@/app/Components/Users/EditUserModal";
import DeleteUserModal from "@/app/Components/Users/DeleteUserModal";

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

    const handleUpdateUser = async (updatedUser: PartialUserWithPartialProfile) => {
        if (!selectedUser) return;
        try {
            const apiClient = getApiClient();
            const savedUser = await apiClient.updateUser(selectedUser._id, updatedUser);
            setUsers(users.map(user => user._id === savedUser._id ? savedUser : user));
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
            setUsers(users.filter(user => user._id !== userToDelete._id));
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
                {isLoggedIn ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">Users Dashboard</h1>
                            <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded">Create User</button>
                        </div>
                        {loading && <div>Loading...</div>}
                        {error && <div className="text-red-500">Error: Failed to edit, 0 occurrences found for old_string ("use client";

import React from 'react';
import UserList from "@/app/Components/Users/UserList";
import { useAuth } from "@/app/lib/auth/useAuth";
import LoginForm from "@/app/Components/Auth/loginForm";
import { Header } from "@/app/Components/layout/header/Header";

const UsersPage = () => {
    const { isLoggedIn } = useAuth();

    return (
        <>
            <Header />
            <main className="p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Users Dashboard</h1>
                {isLoggedIn ? <UserList /> : <LoginForm />}
            </main>
        </>
    );
};

export default UsersPage;
). Original old_string was ("use client";

import React from 'react';
import UserList from "@/app/Components/Users/UserList";
import { useAuth } from "@/app/lib/auth/useAuth";
import LoginForm from "@/app/Components/Auth/loginForm";
import { Header } from "@/app/Components/layout/header/Header";

const UsersPage = () => {
    const { isLoggedIn } = useAuth();

    return (
        <>
            <Header />
            <main className="p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Users Dashboard</h1>
                {isLoggedIn ? <UserList /> : <LoginForm />}
            </main>
        </>
    );
};

export default UsersPage;
) in /Users/jarivankaam/Documents/sites/Avans/Avans-keuze-kompas-mvp/Avans-keuze-kompas-frontend/src/app/users/page.tsx. No edits made. The exact text in old_string was not found. Ensure you're not escaping content incorrectly and check whitespace, indentation, and context. Use read_file tool to verify.</div>}
                        {!loading && !error && <UserList users={users} onEdit={handleEditClick} onDelete={handleDeleteClick} />}
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
