import { useGetPropertyQuery } from "@/state/api";
import { MapPin, Star } from "lucide-react";
import React from "react";

const PropertyOverview = ({ property }: PropertyOverviewProps) => {
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
        <h1 className="text-3xl font-bold my-5">{property.name}</h1>
        <div className="flex justify-between items-center">
          <span className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1 text-gray-700" />
            {property.location?.city}, {property.location?.state},{" "}
            {property.location?.country}
          </span>
          <div className="flex justify-between items-center gap-3">
            <span className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {property.averageRating.toFixed(1)} ({property.numberofReviews}{" "}
              Reviews)
            </span>
            <span className="text-green-600">Verified Listing</span>
          </div>
        </div>
      </div>
      {/* Details */}
      <div className="border border-primary-200 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center gap-4 px-5">
          <div>
            <div className="text-sm text-gray-500">Monthly Rent</div>
            <div className="font-semibold">
              ₹{property.pricePerMonth.toLocaleString()}
            </div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Bedrooms</div>
            <div className="font-semibold">{property.beds}</div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Bathrooms</div>
            <div className="font-semibold">{property.baths} </div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Square Feet</div>
            <div className="font-semibold">
              {property.squareFeet.toLocaleString()} sq ft
            </div>
          </div>
        </div>
      </div>
      {/* Summary */}
      <div className="my-16">
        <h2 className="text-xl font-semibold mb-5">About {property.name}</h2>
        <p className="text-gray-500 leading-7">
          {property.description} Experience resort-style luxury living at{" "}
          {property.name}, where tranquil green surroundings and vibrant city
          life come together seamlessly in {property.city}. This newly built
          residential community features thoughtfully designed two and
          three-bedroom homes, each offering premium designer finishes, elegant
          quartz countertops, modern stainless-steel appliances, a dedicated
          work-from-home nook, and a full-size in-unit washer and dryer for
          everyday convenience. Find your personal escape at home with
          beautifully crafted swimming pools and relaxing spa areas, complete
          with stylish poolside seating and cabanas. Residents are surrounded by
          lush landscaped courtyards, offering inviting indoor-outdoor
          entertainment spaces ideal for social gatherings or peaceful downtime.
          By day, unwind in the BBQ and leisure zones while enjoying expansive
          open views of the surrounding skyline, and by night, take in the calm
          glow of the city under thoughtfully designed ambient lighting. Stay
          active and refreshed with access to a full-size, state-of-the-art
          fitness center and a dedicated yoga studio, designed to support a
          balanced and healthy lifestyle. Work closer to home with a fully
          equipped business center and conference room, conveniently located
          next to a high-speed internet and coffee lounge—perfect for meetings,
          remote work, or casual collaboration. Ideally located within{" "}
          {property.city}, {property.name} offers excellent connectivity to
          major roads and business corridors, along with easy access to premium
          shopping destinations, reputed educational institutions, and leading
          healthcare centers. Whether commuting to work or exploring the city,
          everything you need is just minutes away. Experience elevated living
          where comfort, convenience, and sophistication come together.{" "}
          {property.name} is a premium apartment community located in{" "}
          {property.city}, offering a refined lifestyle in one of the
          city&lsquo;s most well-connected and desirable areas. Contact us today
          to schedule a tour and make the {property.name} luxury lifestyle your
          own.
        </p>
      </div>
    </div>
  );
};

export default PropertyOverview;
