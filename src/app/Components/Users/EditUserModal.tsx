'use client';

import React, { useState, useEffect } from 'react';
import type { User, Profile, PartialUserWithPartialProfile } from '@/app/types/User';
import { Checkbox } from "@/components/ui/checkbox"

interface EditUserModalProps {
    user: User | null;
    onClose: () => void;
    onUpdate: (updatedUser: PartialUserWithPartialProfile) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<PartialUserWithPartialProfile>(user || {});

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

    const handleCheckboxChange = (name: 'is_admin' | 'is_student', value: boolean | 'indeterminate') => {
        if (value === 'indeterminate') return;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
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
                    <div className="mb-4 flex flex-col gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="is_admin" checked={formData.is_admin} onCheckedChange={(checked) => handleCheckboxChange('is_admin', checked)} />
                            <label
                                htmlFor="is_admin"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Is Admin
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="is_student" checked={formData.is_student} onCheckedChange={(checked) => handleCheckboxChange('is_student', checked)} />
                            <label
                                htmlFor="is_student"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Is Student
                            </label>
                        </div>
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
