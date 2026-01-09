"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { AmenityIcons, PropertyTypeIcons } from "@/lib/constants";
import { cleanParams, cn, formatEnumString } from "@/lib/utils";
import { FiltersState, initialFilters, setFilters } from "@/state";
import { useAppSelector } from "@/state/redux";
import { debounce } from "lodash";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const FiltersFull = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const [isApplying, setIsApplying] = useState(false);

  const geocodeLocation = async (filters: FiltersState) => {
    if (!filters.location || filters.location.length < 2) {
      return filters;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          filters.location
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }&fuzzyMatch=true`
      );

      const data = await response.json();
      if (!data.features?.length) return filters;

      const [lng, lat] = data.features[0].center;

      return {
        ...filters,
        coordinates: [Number(lng), Number(lat)] as [number, number],
      };
    } catch (err) {
      console.error("Location search failed", err);
      return filters;
    }
  };

  const updateURL = debounce((newFilters: FiltersState) => {
    const cleanFilters = cleanParams(newFilters);
    const updatedSearchParams = new URLSearchParams();

    Object.entries(cleanFilters).forEach(([key, value]) => {
      if (key === "amenities" && Array.isArray(value)) {
        updatedSearchParams.set(key, value.join(","));
      } else {
        updatedSearchParams.set(key, String(value));
      }
    });

    router.push(`${pathname}?${updatedSearchParams.toString()}`);
  });

  const handleSubmit = async () => {
    setIsApplying(true);
    const resolvedFilters = await geocodeLocation(localFilters);
    dispatch(setFilters(resolvedFilters));
    updateURL(resolvedFilters);
    setIsApplying(false);
  };

  const handleReset = () => {
    setLocalFilters(initialFilters);
    dispatch(setFilters(initialFilters));
    updateURL(initialFilters);
  };

  const handleAmenityChange = (amenity: AmenityEnum) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  if (!isFiltersFullOpen) return null;

  return (
    <div className="bg-white rounded-lg px-4 h-full overflow-auto pb-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h4 className="font-bold mb-2">Location</h4>

          <div className="relative w-full">
            {/* Search icon */}
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <Input
              placeholder="Enter location"
              value={localFilters.location}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  location: e.target.value,
                  coordinates: undefined,
                }))
              }
              className="w-full pl-10 rounded-xl"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <h4 className="font-bold mb-2">Property Type</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <div
                key={type}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer",
                  localFilters.propertyType === type
                    ? "border-black"
                    : "border-gray-200"
                )}
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    propertyType: type as PropertyTypeEnum,
                  }))
                }
              >
                <Icon className="w-6 h-6 mb-2" />
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-bold mb-2">Price Range (Monthly)</h4>
          <Slider
            min={0}
            max={10000}
            step={100}
            value={[
              localFilters.priceRange[0] ?? 0,
              localFilters.priceRange[1] ?? 10000,
            ]}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({
                ...prev,
                priceRange: value as [number, number],
              }))
            }
            className="[&_[data-slot=slider-range]]:bg-primary-700"
          />
          <div className="flex justify-between mt-2">
            <span>₹{localFilters.priceRange[0] ?? 0}</span>
            <span>₹{localFilters.priceRange[1] ?? 10000}</span>
          </div>
        </div>
        {/* Beds and Baths */}
        <div className="flex gap-4">
          <div className="flex-1">
            <h4 className="font-bold mb-2">Beds</h4>
            {/* Beds Selector */}
            <Select
              value={localFilters.beds}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  beds: value,
                }))
              }
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
          </div>
          {/* Baths Selector */}
          <div className="flex-1">
            <h4 className="font-bold mb-2">Baths</h4>
            <Select
              value={localFilters.baths}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  baths: value,
                }))
              }
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
        </div>

        {/* Square Feet */}
        <div>
          <h4 className="font-bold mb-2">Square Feet</h4>
          <Slider
            min={0}
            max={5000}
            step={100}
            value={[
              localFilters.squareFeet[0] ?? 0,
              localFilters.squareFeet[1] ?? 5000,
            ]}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({
                ...prev,
                squareFeet: value as [number, number],
              }))
            }
            className="[&_[data-slot=slider-range]]:bg-primary-700"
          />
          <div className="flex justify-between mt-2">
            <span>{localFilters.squareFeet[0] ?? 0} sq ft</span>
            <span>{localFilters.squareFeet[1] ?? 5000} sq ft</span>
          </div>
        </div>
        {/* Amenities */}
        <div>
          <h4 className="font-bold mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(AmenityIcons).map(([amenity, Icon]) => (
              <div
                key={amenity}
                className={cn(
                  "flex items-center space-x-2 p-2 border rounded-lg hover:cursor-pointer",
                  localFilters.amenities.includes(amenity as AmenityEnum)
                    ? "border-black"
                    : "border-gray-200"
                )}
                onClick={() => handleAmenityChange(amenity as AmenityEnum)}
              >
                <Icon className="w-5 h-5 hover:cursor-pointer" />
                <Label className="hover:cursor-pointer">
                  {formatEnumString(amenity)}
                </Label>
              </div>
            ))}
          </div>
        </div>
        {/* Available From */}
        <div>
          <h4 className="font-bold mb-2">Available From</h4>
          <Input
            type="date"
            value={
              localFilters.availableFrom !== "any"
                ? localFilters.availableFrom
                : ""
            }
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                availableFrom: e.target.value ? e.target.value : "any",
              }))
            }
          />
        </div>
        {/* Apply and Reset Buttons */}

        <div className="flex gap-4 mt-6">
          <Button
            className="flex-1 bg-primary-700 text-white rounded-xl"
            onClick={handleSubmit}
            disabled={isApplying}
          >
            Apply
          </Button>
          <Button
            className="flex-1 rounded-xl"
            onClick={handleReset}
            variant="outline"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersFull;
