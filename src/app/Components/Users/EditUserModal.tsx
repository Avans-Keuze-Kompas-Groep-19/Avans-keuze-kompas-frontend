'use client';

import React, { useState, useEffect } from 'react';
import type { User, Profile } from '@/app/types/User';

type FormData = Omit<Partial<User>, 'profile'> & { profile?: Partial<Profile> };

interface EditUserModalProps {
    user: User | null;
    onClose: () => void;
    onUpdate: (updatedUser: Partial<User>) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<FormData>(user || {});

    useEffect(() => {
        setFormData(user || {});
    }, [user]);

    if (!user) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('profile.')) {
            const field = name.split('.')[1] as keyof Profile;
            setFormData(prev => ({
                ...prev,
                profile: {
                    ...(prev.profile || {}),
                    [field]: value,
                },
            }));
        } else {
            const field = name as keyof Omit<User, 'profile'>;
            setFormData(prev => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="profile.first_name"
                            value={formData.profile?.first_name || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="profile.last_name"
                            value={formData.profile?.last_name || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Group</label>
                        <input
                            type="text"
                            name="group"
                            value={formData.group || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
