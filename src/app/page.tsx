// app/page.tsx
import HeroSection from "@/app/Components/layout/Hero/Hero";
import ItemsView from "./Components/VKM/VKMItem";
import { Header } from "@/app/Components/layout/header/Header";
import SidebarFilters from "@/app/Components/layout/popupables/Sidebar/Sidebar";
import Sidebar from "@/app/Components/layout/popupables/Sidebar/Sidebar";

export default function Home() {
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
        <ItemsView />
      </main>
    </>
  );
}
