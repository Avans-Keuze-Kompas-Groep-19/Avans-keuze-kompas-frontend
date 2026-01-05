'use client';

import React from 'react';
import type { User } from '@/app/types/User';

interface DeleteUserModalProps {
    user: User | null;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ user, onClose, onConfirm }) => {
    if (!user) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Delete User</h2>
                <p>Are you sure you want to delete the user "{user.username}"?</p>
                <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
                <div className="flex justify-end gap-4 mt-8">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;
