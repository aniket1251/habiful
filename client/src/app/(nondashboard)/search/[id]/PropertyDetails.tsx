import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AmenityIcons, HighlightIcons } from "@/lib/constants";
import { formatEnumString } from "@/lib/utils";
import { useGetPropertyQuery } from "@/state/api";
import { HelpCircle } from "lucide-react";
import React from "react";

const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  return (
    <div className="mb-6">
      {/* Amenities */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold my-3">Property Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {(property.amenities ?? []).map((amenity: AmenityEnum) => {
            const Icon = AmenityIcons[amenity as AmenityEnum] || HelpCircle;
            return (
              <div
                key={amenity}
                className="flex flex-col items-center border rounded-xl py-4 sm:py-6 md:py-8 px-2 sm:px-4"
              >
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-gray-700" />
                <span className="text-xs sm:text-sm text-center text-gray-700">
                  {formatEnumString(amenity)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights */}
      <div className="mt-8 sm:mt-12 mb-8 sm:mb-12 md:mb-16">
        <h3 className="text-lg sm:text-xl font-semibold text-primary-800 dark:text-primary-100">
          Highlights
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-4 w-full">
          {(property.highlights ?? []).map((highlight: HighlightEnum) => {
            const Icon =
              HighlightIcons[highlight as HighlightEnum] || HelpCircle;
            return (
              <div
                key={highlight}
                className="flex flex-col items-center border rounded-xl py-4 sm:py-6 md:py-8 px-2 sm:px-4"
              >
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-primary-600 dark:text-primary-300" />
                <span className="text-xs sm:text-sm text-center text-primary-600 dark:text-primary-300">
                  {formatEnumString(highlight)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Section */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-primary-800 dark:text-primary-100 mb-3 sm:mb-5">
          Fees and Policies
        </h3>
        <p className="text-xs sm:text-sm text-primary-600 dark:text-primary-300 mt-2">
          The fees below are based on community-supplied data and may exclude
          additional fees and utilities.
        </p>
        <Tabs defaultValue="required-fees" className="mt-6 sm:mt-8">
          <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-3 sm:grid-cols-3">
            <TabsTrigger value="required-fees" className="text-xs sm:text-sm">Required Fees</TabsTrigger>
            <TabsTrigger value="pets" className="text-xs sm:text-sm">Pets</TabsTrigger>
            <TabsTrigger value="parking" className="text-xs sm:text-sm">Parking</TabsTrigger>
          </TabsList>
          <TabsContent value="required-fees" className="mt-4">
            <div className="max-w-md">
            <p className="font-semibold mt-5 mb-2">One time move in fees</p>
            <hr />
            <div className="flex justify-between py-2 bg-secondary-50">
              <span className="text-primary-700 font-medium">
                Application Fee
              </span>
              <span className="text-primary-700">
                ₹{property.applicationFee ?? 0}
              </span>
            </div>
            <hr />
            <div className="flex justify-between py-2 bg-secondary-50">
              <span className="text-primary-700 font-medium">
                Security Deposit
              </span>
              <span className="text-primary-700">
                ₹{property.securityDeposit ?? 0}
              </span>
            </div>
            <hr />
            </div>
          </TabsContent>
          <TabsContent value="pets">
            <p className="font-semibold mt-5 mb-2">
              Pets are {property.isPetsAllowed ? "allowed" : "not allowed"}
            </p>
          </TabsContent>
          <TabsContent value="parking">
            <p className="font-semibold mt-5 mb-2">
              Parking is{" "}
              {property.isParkingIncluded ? "included" : "not included"}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyDetails;
