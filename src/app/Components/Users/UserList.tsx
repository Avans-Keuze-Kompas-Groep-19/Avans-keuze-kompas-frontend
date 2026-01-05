'use client';

import React, { useEffect, useState } from 'react';
import { getApiClient } from '@/app/lib/apiClient';
import type { User } from '@/app/types/User';
import type { ApiError } from '@/app/lib/apiClient';

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
                <div key={user._id} className="border p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">{`${user.profile.first_name} ${user.profile.last_name}`}</h2>
                    <p className="text-gray-600">{user.email}</p>
                </div>
            ))}
        </div>
    );
};

export default UserList;
