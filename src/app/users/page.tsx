import React from "react";
import UserList from "@/app/Components/Users/UserList";
import { Header } from "../Components/layout/header/Header";

const UsersPage = () => {
  return (
    <>
      <Header />
      <main className="flex flex-col justify-center items-center m-10">
        <div>
          <h1 className="text-2xl font-bold mb-4">All Users</h1>
          <UserList />
        </div>
      </main>
    </>
  );
};

export default UsersPage;
