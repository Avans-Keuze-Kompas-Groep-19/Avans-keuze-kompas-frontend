// app/page.tsx
'use client'
import { useEffect, useState } from 'react';
import HeroSection from "@/app/Components/layout/Hero/Hero";
import ItemsView from "./Components/VKM/VKMItem";
import { Header } from "@/app/Components/layout/header/Header";
import ModalForm from "@/app/Components/layout/popupables/QuizModal/QuizModal";
import { useAuth } from "./lib/auth/useAuth";
import { getApiClient } from './lib/apiClient';
import { User } from './types/User';

export default function Home() {
  const { isLoggedIn, user } = useAuth();
  const [fullUser, setFullUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      const api = getApiClient();
      api.getUser(user.sub).then(setFullUser);
    }
  }, [user]);

  const hasRecommendations = fullUser && fullUser.recommended_vkms && fullUser.recommended_vkms.length > 0;

  return (
    <>
      <Header />
      <main className="flex flex-col justify-center items-center m-10">
        <HeroSection
          heading="Een keuzemodule uitkiezen? Wij helpen je!"
          description=""
          imageSrc="/hero.png"
          imageAlt="Hero image"
          background="#c6002a"
        />
        <div className="m-5"></div>
        {isLoggedIn && hasRecommendations ? <ItemsView recommendation={true} /> : <ModalForm />}
        <div className="m-5"></div>
        <div className="m-5"></div>
        <ItemsView />
      </main>
    </>
  );
}
