"use client";

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
