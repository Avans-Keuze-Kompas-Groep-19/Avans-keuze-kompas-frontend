"use client";

import React from "react";
import type { User } from "@/app/types/User";

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
  if (!users || users.length === 0) {
    return <div>No users found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <div key={user._id} className="border p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">{`${user.profile.first_name} ${user.profile.last_name}`}</h2>
          <p className="text-gray-600">
            {user.email} - {user.group}
          </p>
          <p className="mt-"> Type Gebruiker:</p>
          <p className="text-gray-600">
            {user.is_admin ? "Admin rechtem" : "Gebruiker"} -{" "}
            {user.is_student ? "Student" : "Medewerker"}
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onEdit(user)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(user)}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
