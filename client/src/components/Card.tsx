"use client";
import { Bath, Bed, Heart, House, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Card = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
}: CardProps) => {
  const [imgSrc, setImgSrc] = useState(
    property?.photoUrls?.[0] || "/placeholder.jpg"
  );

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full mb-4 sm:mb-5">
      <div className="relative">
        <div className="w-full h-36 sm:h-44 md:h-48 relative">
          <Image
            src={imgSrc}
            alt={property.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc("/placeholder.jpg")}
          />
        </div>
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex gap-1 sm:gap-2">
          {property.isPetsAllowed && (
            <span className="bg-white/80 text-black text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
              Pets Allowed
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="bg-white/80 text-black text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
              Parking Included
            </span>
          )}
        </div>
        {showFavoriteButton && (
          <button
            className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-white hover:bg-white/90 rounded-full p-1.5 sm:p-2 cursor-pointer"
            onClick={onFavoriteToggle}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
              }`}
            />
          </button>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-0.5 sm:mb-1 line-clamp-1">
          {propertyLink ? (
            <Link
              href={propertyLink}
              className="hover:underline hover:text-blue-600"
            >
              {property.name}
            </Link>
          ) : (
            property.name
          )}
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm mb-1.5 sm:mb-2 line-clamp-1">
          {property?.location?.address}, {property?.location?.city}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center mb-1 sm:mb-2">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-0.5 sm:mr-1" />
            <span className="font-semibold text-xs sm:text-sm">
              {property.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600 ml-0.5 sm:ml-1 text-xs sm:text-sm">
              ({property.numberOfReviews} Reviews)
            </span>
          </div>
          <p className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3">
            ₹{property.pricePerMonth.toFixed(0)}{" "}
            <span className="text-gray-600 text-xs sm:text-sm md:text-base font-normal">/month</span>
          </p>
        </div>
        <hr />
        <div className="flex justify-between items-center gap-2 sm:gap-4 text-gray-600 mt-3 sm:mt-5 font-semibold text-xs sm:text-sm">
          <span className="flex items-center">
            <Bed className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            {property.beds} Bed
          </span>
          <span className="flex items-center">
            <Bath className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            {property.baths} Bath
          </span>
          <span className="flex items-center">
            <House className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            {property.squareFeet} sq ft
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
