import React from "react";
import UserList from "@/app/Components/Users/UserList";
import { Header } from "../Components/layout/header/Header";
import HeroSection from "../Components/layout/Hero/Hero";

const UsersPage = () => {
  return (
    <>
      <Header />
      <main className="flex flex-col justify-center m-10">
        <HeroSection
          heading="Bewerk hier alle gebruikers!"
          description=""
          imageSrc="/hero.png"
          imageAlt="Hero image"
          background="#c6002a"
        />
        <div>
          <h1 className="text-2xl font-bold mb-4">All Users</h1>
          <UserList />
        </div>
      </main>
    </>
  );
};

export default UsersPage;
