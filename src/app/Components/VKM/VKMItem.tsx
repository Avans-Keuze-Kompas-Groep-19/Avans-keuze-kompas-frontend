"use client";

import { useState } from "react";
import { useItems, type VkmFilters } from "../../lib/useItem";
import { ItemCard } from "./ItemCard";
import Sidebar from "@/app/Components/layout/popupables/Sidebar/Sidebar";

export default function ItemsView({
  recommendation = false,
}: {
  recommendation?: boolean;
}) {
  const [filters, setFilters] = useState<VkmFilters>({});
  const { items, loading, error } = useItems(filters, recommendation);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center md:hidden">
        <h2 className="text-2xl font-bold">
          {recommendation ? "Aanbevolen" : "Alle keuze modules"}
        </h2>
        {!recommendation && (
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex gap-5">
        {!recommendation && (
          <>
            <div
              className={`fixed top-0 left-0 h-full bg-white z-20 w-full transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-1/4`}
            >
              <div className="flex justify-between items-center p-4 md:hidden">
                <h2 className="text-2xl font-bold">Filters</h2>
                <button onClick={() => setSidebarOpen(false)} className="p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {isSidebarOpen && (
                <div
                  className="w-[50px] h-[50px] absolute right-[10px] top-[150px]"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M6 6L18 18"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                      ></path>{" "}
                      <path
                        d="M18 6L6 18"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
              )}
              <Sidebar
                heading="Filters"
                description="Kies hier je filters"
                value={filters}
                onChange={setFilters}
              />
            </div>
          </>
        )}

        <div className="w-full">
          <h2 className="hidden md:block text-3xl mb-2 font-bold">
            {recommendation
              ? "Aanbevolen keuze modules:"
              : "Alle keuze modules:"}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
            {(recommendation ? items.slice(0, 3) : items).map((item, index) => (
              <ItemCard key={item._id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
