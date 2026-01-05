import React from 'react';
import UserList from "@/app/Components/Users/UserList";

const UsersPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">All Users</h1>
            <UserList />
        </div>
    );
};

export default UsersPage;
