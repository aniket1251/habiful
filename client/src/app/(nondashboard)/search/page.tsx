"use client";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FiltersBar from "./FiltersBar";
import FiltersFull from "./FiltersFull";
import { cleanParams } from "@/lib/utils";
import { setFilters } from "@/state";
import Map from "./Map";
import Listings from "./Listings";
import { Maximize2, X } from "lucide-react";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );
  const [isMobileMapExpanded, setIsMobileMapExpanded] = useState(false);

  useEffect(() => {
    const initialFilters = Array.from(searchParams.entries()).reduce(
      (acc: any, [key, value]) => {
        if (key === "priceRange" || key === "squareFeet") {
          acc[key] = value.split(",").map((v) => (v === "" ? null : Number(v)));
        } else if (key === "coordinates") {
          acc[key] = value.split(",").map(Number);
        } else {
          acc[key] = value === "any" ? null : value;
        }

        return acc;
      },
      {}
    );

    const cleanedFilters = cleanParams(initialFilters);
    dispatch(setFilters(cleanedFilters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="w-full mx-auto px-5 flex flex-col relative"
      style={{
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <FiltersBar />
      
      {/* Mobile Layout: Map above Listings - all scrollable */}
      <div className="md:hidden flex-1 overflow-y-auto mb-5">
        {/* Mini Map - 40vh height */}
        <div className="h-[40vh] relative rounded-xl overflow-hidden mb-3">
          <Map />
          <button
            onClick={() => setIsMobileMapExpanded(true)}
            className="absolute bottom-3 right-3 z-10 bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Expand map"
          >
            <Maximize2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        {/* Listings */}
        <Listings />
      </div>

      {/* Desktop Layout: Side by side */}
      <div className="hidden md:flex justify-between flex-1 overflow-hidden gap-3 mb-5">
        <div
          className={`h-full overflow-auto transition-all duration-300 ease-in-out ${
            isFiltersFullOpen
              ? "w-3/12 opacity-100 visible"
              : "w-0 opacity-0 invisible"
          }`}
        >
          <FiltersFull />
        </div>
        <div className="basis-5/12 grow h-full">
          <Map />
        </div>
        <div className="basis-4/12 overflow-y-auto">
          <Listings />
        </div>
      </div>

      {/* Mobile Expanded Map Overlay */}
      {isMobileMapExpanded && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 p-4 pt-6">
          <div className="relative h-full w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-sm border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Explore Map</h3>
              <button
                onClick={() => setIsMobileMapExpanded(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close map"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {/* Map Container */}
            <div className="h-full w-full pt-14">
              <Map />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
