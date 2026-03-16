import { useGetPropertyQuery } from "@/state/api";
import { MapPin, Star } from "lucide-react";
import React, { useState } from "react";

const PropertyOverview = ({ property }: PropertyOverviewProps) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const fullDescription = `${property.description} Experience resort-style luxury living at ${property.name}, where tranquil green surroundings and vibrant city life come together seamlessly in ${property.location?.city}. This newly built residential community features thoughtfully designed two and three-bedroom homes, each offering premium designer finishes, elegant quartz countertops, modern stainless-steel appliances, a dedicated work-from-home nook, and a full-size in-unit washer and dryer for everyday convenience. Find your personal escape at home with beautifully crafted swimming pools and relaxing spa areas, complete with stylish poolside seating and cabanas. Residents are surrounded by lush landscaped courtyards, offering inviting indoor-outdoor entertainment spaces ideal for social gatherings or peaceful downtime. By day, unwind in the BBQ and leisure zones while enjoying expansive open views of the surrounding skyline, and by night, take in the calm glow of the city under thoughtfully designed ambient lighting. Stay active and refreshed with access to a full-size, state-of-the-art fitness center and a dedicated yoga studio, designed to support a balanced and healthy lifestyle. Work closer to home with a fully equipped business center and conference room, conveniently located next to a high-speed internet and coffee lounge—perfect for meetings, remote work, or casual collaboration. Ideally located within ${property.location?.city}, ${property.name} offers excellent connectivity to major roads and business corridors, along with easy access to premium shopping destinations, reputed educational institutions, and leading healthcare centers. Whether commuting to work or exploring the city, everything you need is just minutes away. Experience elevated living where comfort, convenience, and sophistication come together. ${property.name} is a premium apartment community located in ${property.location?.city}, offering a refined lifestyle in one of the city's most well-connected and desirable areas. Contact us today to schedule a tour and make the ${property.name} luxury lifestyle your own.`;

  const truncatedDescription = fullDescription.slice(0, 300);
  const shouldTruncate = fullDescription.length > 300;

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">
          {property.location?.country} / {property.location?.state} /{" "}
          <span className="font-semibold text-gray-600">
            {property.location?.city}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold my-3 sm:my-5">{property.name}</h1>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <span className="flex items-center text-gray-500 text-sm sm:text-base">
            <MapPin className="w-4 h-4 mr-1 text-gray-700" />
            {property.location?.city}, {property.location?.state},{" "}
            {property.location?.country}
          </span>
          <div className="flex justify-between sm:justify-end items-center gap-3 text-sm sm:text-base">
            <span className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {(property.averageRating ?? 0).toFixed(1)} ({property.numberofReviews ?? 0}{" "}
              Reviews)
            </span>
            <span className="text-green-600">Verified Listing</span>
          </div>
        </div>
      </div>
      {/* Details */}
      <div className="border border-primary-200 rounded-xl p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:flex sm:justify-between sm:items-center sm:px-5">
          <div className="text-center sm:text-left">
            <div className="text-xs sm:text-sm text-gray-500">Monthly Rent</div>
            <div className="font-semibold text-sm sm:text-base">
              ₹{(property.pricePerMonth ?? 0).toLocaleString()}
            </div>
          </div>
          <div className="hidden sm:block border-l border-gray-300 h-10"></div>
          <div className="text-center sm:text-left">
            <div className="text-xs sm:text-sm text-gray-500">Bedrooms</div>
            <div className="font-semibold text-sm sm:text-base">{property.beds ?? 0}</div>
          </div>
          <div className="hidden sm:block border-l border-gray-300 h-10"></div>
          <div className="text-center sm:text-left">
            <div className="text-xs sm:text-sm text-gray-500">Bathrooms</div>
            <div className="font-semibold text-sm sm:text-base">{property.baths ?? 0}</div>
          </div>
          <div className="hidden sm:block border-l border-gray-300 h-10"></div>
          <div className="text-center sm:text-left">
            <div className="text-xs sm:text-sm text-gray-500">Square Feet</div>
            <div className="font-semibold text-sm sm:text-base">
              {(property.squareFeet ?? 0).toLocaleString()} sq ft
            </div>
          </div>
        </div>
      </div>
      {/* Summary */}
      <div className="my-8 sm:my-12 md:my-16">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-5">About {property.name}</h2>
        <p className="text-gray-500 leading-6 sm:leading-7 text-sm sm:text-base">
          {isDescriptionExpanded || !shouldTruncate
            ? fullDescription
            : `${truncatedDescription}...`}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="mt-3 text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base transition-colors"
          >
            {isDescriptionExpanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PropertyOverview;
