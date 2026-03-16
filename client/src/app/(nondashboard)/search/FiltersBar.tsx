"use client";
import { cleanParams, cn, formatPriceValue } from "@/lib/utils";
import { useAppSelector } from "@/state/redux";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import {
  FiltersState,
  initialFilters,
  setFilters,
  setViewMode,
  toggleFiltersFullOpen,
} from "@/state";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List, Menu, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyTypeIcons } from "@/lib/constants";

const FiltersBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const [searchInput, setSearchInput] = useState(filters.location);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const updateURLRef = useRef<ReturnType<typeof debounce> | null>(null);

  useEffect(() => {
    updateURLRef.current = debounce((newFilters: FiltersState) => {
      const cleanFilters = cleanParams(newFilters);
      const params = new URLSearchParams();

      Object.entries(cleanFilters).forEach(([key, value]) => {
        params.set(
          key,
          Array.isArray(value) ? value.join(",") : value.toString()
        );
      });

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }, 100);

    return () => {
      updateURLRef.current?.cancel();
    };
  }, [router, pathname]);

  const handleFilterChange = (
    key: string,
    value: any,
    isMin: boolean | null
  ) => {
    let newValue = value;

    if (key === "priceRange" || key === "squareFeet") {
      const currentArrayRange = [...filters[key]];
      if (isMin !== null) {
        const index = isMin ? 0 : 1;
        currentArrayRange[index] = value === "any" ? null : Number(value);
      }
      newValue = currentArrayRange;
    } else if (key === "coordinates") {
      newValue = value === "any" ? [0, 0] : value.map(Number);
    } else {
      newValue = value === "any" ? "any" : value;
    }

    const newFilters = { ...filters, [key]: newValue };
    dispatch(setFilters(newFilters));
    updateURLRef.current?.(newFilters);
  };

  const handleReset = () => {
    dispatch(setFilters(initialFilters));
    updateURLRef.current?.(initialFilters);
  };

  useEffect(() => {
    setSearchInput(filters.location);
  }, [filters.location]);

  const handleLocationSearch = async () => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchInput
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }&fuzzyMatch=true`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const center = data.features[0].center;
        const coordinates: [number, number] = [
          Number(center[0]),
          Number(center[1]),
        ];
        const newFilters = { ...filters, location: searchInput, coordinates };
        dispatch(setFilters(newFilters));
        updateURLRef.current?.(newFilters);
      }
    } catch (err) {
      console.error("Location search failed:", err);
    }
  };

  return (
    <>
      {/* Mobile: Search bar + hamburger + view mode */}
      <div className="flex md:hidden justify-between items-center w-full py-3 gap-2">
        <div className="flex items-center flex-1">
          <Input
            placeholder="Search location"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 rounded-l-xl rounded-r-none border-primary-400 border-r-0"
          />
          <Button
            onClick={handleLocationSearch}
            className="rounded-r-xl rounded-l-none border-primary-400 shadow-none border hover:bg-primary-700 hover:text-primary-50"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          className="rounded-xl border-primary-400"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex border rounded-xl">
          <Button
            variant="ghost"
            className={cn(
              "px-2 py-1 rounded-none rounded-l-xl",
              viewMode === "list" ? "bg-primary-700 text-primary-50" : ""
            )}
            onClick={() => dispatch(setViewMode("list"))}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "px-2 py-1 rounded-none rounded-r-xl",
              viewMode === "grid" ? "bg-primary-700 text-primary-50" : ""
            )}
            onClick={() => dispatch(setViewMode("grid"))}
          >
            <Grid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Filters Drawer - Bottom Sheet Style */}
      {isMobileFiltersOpen && (
        <div className="md:hidden fixed left-0 right-0 bottom-0 z-50 bg-white shadow-lg rounded-t-2xl">
          <div className="px-5 py-5">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                className="p-1"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <div className="flex gap-2">
                  <Select
                    value={filters.priceRange[0]?.toString() || "any"}
                    onValueChange={(value) =>
                      handleFilterChange("priceRange", value, true)
                    }
                  >
                    <SelectTrigger className="flex-1 rounded-xl border-primary-400">
                      <SelectValue>
                        {formatPriceValue(filters.priceRange[0], true)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="any">Any Min</SelectItem>
                      {[500, 1000, 1500, 2000, 3000, 5000, 10000].map((price, idx) => (
                        <SelectItem key={idx} value={price.toString()}>
                          ₹{price / 1000}k+
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.priceRange[1]?.toString() || "any"}
                    onValueChange={(value) =>
                      handleFilterChange("priceRange", value, false)
                    }
                  >
                    <SelectTrigger className="flex-1 rounded-xl border-primary-400">
                      <SelectValue>
                        {formatPriceValue(filters.priceRange[1], false)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="any">Any Max</SelectItem>
                      {[1000, 2000, 3000, 5000, 10000].map((price, idx) => (
                        <SelectItem key={idx} value={price.toString()}>
                          ₹{price / 1000}k+
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Beds & Baths */}
              <div>
                <label className="text-sm font-medium mb-2 block">Beds & Baths</label>
                <div className="flex gap-2">
                  <Select
                    value={filters.beds}
                    onValueChange={(value) => handleFilterChange("beds", value, null)}
                  >
                    <SelectTrigger className="flex-1 rounded-xl border-primary-400">
                      <SelectValue placeholder="Beds" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="any">Any Beds</SelectItem>
                      <SelectItem value="1">1+ bed</SelectItem>
                      <SelectItem value="2">2+ beds</SelectItem>
                      <SelectItem value="3">3+ beds</SelectItem>
                      <SelectItem value="4">4+ beds</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.baths}
                    onValueChange={(value) => handleFilterChange("baths", value, null)}
                  >
                    <SelectTrigger className="flex-1 rounded-xl border-primary-400">
                      <SelectValue placeholder="Baths" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="any">Any Baths</SelectItem>
                      <SelectItem value="1">1+ bath</SelectItem>
                      <SelectItem value="2">2+ baths</SelectItem>
                      <SelectItem value="3">3+ baths</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Property Type</label>
                <Select
                  value={filters.propertyType || "any"}
                  onValueChange={(value) =>
                    handleFilterChange("propertyType", value, null)
                  }
                >
                  <SelectTrigger className="w-full rounded-xl border-primary-400">
                    <SelectValue placeholder="Home Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="any">Any Property Type</SelectItem>
                    {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center">
                          <Icon className="w-4 h-4 mr-2" />
                          <span>{type}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    handleReset();
                    setIsMobileFiltersOpen(false);
                  }}
                  variant="outline"
                >
                  Reset
                </Button>
                <Button
                  className="flex-1 bg-primary-700 text-white rounded-xl"
                  onClick={() => setIsMobileFiltersOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Full filters bar */}
      <div className="hidden md:flex justify-between items-center w-full py-5">
        <div className="flex justify-between items-center gap-4 p-2">
          <Button
            variant="outline"
            className={cn(
              "gap-2 rounded-xl border-primary-400 hover:bg-primary-500 hover:text-primary-100",
              isFiltersFullOpen && "bg-primary-700 text-primary-100"
            )}
            onClick={() => dispatch(toggleFiltersFullOpen())}
          >
            <Filter className="w-4 h-4" />
            <span>All Filters</span>
          </Button>

          <div className="flex items-center">
            <Input
              placeholder="Search location"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-40 rounded-l-xl rounded-r-none border-primary-400 border-r-0"
            />
            <Button
              onClick={handleLocationSearch}
              className="rounded-r-xl rounded-l-none border-l-none border-primary-400 shadow-none border hover:bg-primary-700 hover:text-primary-50"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-1">
            <Select
              value={filters.priceRange[0]?.toString() || "any"}
              onValueChange={(value) =>
                handleFilterChange("priceRange", value, true)
              }
            >
              <SelectTrigger className="w-35 rounded-xl border-primary-400">
                <SelectValue>
                  {formatPriceValue(filters.priceRange[0], true)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="any">Any Min Price</SelectItem>
                {[500, 1000, 1500, 2000, 3000, 5000, 10000].map((price, idx) => (
                  <SelectItem key={idx} value={price.toString()}>
                    ₹{price / 1000}k+
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.priceRange[1]?.toString() || "any"}
              onValueChange={(value) =>
                handleFilterChange("priceRange", value, false)
              }
            >
              <SelectTrigger className="w-36 rounded-xl border-primary-400">
                <SelectValue>
                  {formatPriceValue(filters.priceRange[1], false)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="any">Any Max Price</SelectItem>
                {[1000, 2000, 3000, 5000, 10000].map((price, idx) => (
                  <SelectItem key={idx} value={price.toString()}>
                    ₹{price / 1000}k+
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-1">
            <Select
              value={filters.beds}
              onValueChange={(value) => handleFilterChange("beds", value, null)}
            >
              <SelectTrigger className="w-26 rounded-xl border-primary-400">
                <SelectValue placeholder="Beds" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="any">Any Beds</SelectItem>
                <SelectItem value="1">1+ bed</SelectItem>
                <SelectItem value="2">2+ beds</SelectItem>
                <SelectItem value="3">3+ beds</SelectItem>
                <SelectItem value="4">4+ beds</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.baths}
              onValueChange={(value) => handleFilterChange("baths", value, null)}
            >
              <SelectTrigger className="w-29 rounded-xl border-primary-400">
                <SelectValue placeholder="Baths" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="any">Any Baths</SelectItem>
                <SelectItem value="1">1+ bath</SelectItem>
                <SelectItem value="2">2+ baths</SelectItem>
                <SelectItem value="3">3+ baths</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select
            value={filters.propertyType || "any"}
            onValueChange={(value) =>
              handleFilterChange("propertyType", value, null)
            }
          >
            <SelectTrigger className="w-34 rounded-xl border-primary-400">
              <SelectValue placeholder="Home Type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any">Any Property Type</SelectItem>
              {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    <span>{type}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="bg-primary-700 text-white rounded-xl"
            onClick={handleReset}
            variant="outline"
          >
            Reset Filters
          </Button>
        </div>

        <div className="flex justify-between items-center gap-4 p-2">
          <div className="flex border rounded-xl">
            <Button
              variant="ghost"
              className={cn(
                "px-3 py-1 rounded-none rounded-l-xl hover:bg-primary-600 hover:text-primary-50",
                viewMode === "list" ? "bg-primary-700 text-primary-50" : ""
              )}
              onClick={() => dispatch(setViewMode("list"))}
            >
              <List className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "px-3 py-1 rounded-none rounded-r-xl hover:bg-primary-600 hover:text-primary-50",
                viewMode === "grid" ? "bg-primary-700 text-primary-50" : ""
              )}
              onClick={() => dispatch(setViewMode("grid"))}
            >
              <Grid className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FiltersBar;
