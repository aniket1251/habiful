import { Bath, Bed, Heart, House, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const CardCompact = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
}: CardCompactProps) => {
  const [imgSrc, setImgSrc] = useState(
    property.photoUrls?.[0] || "/placeholder.jpg"
  );

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full flex h-32 sm:h-36 md:h-40 mb-3 sm:mb-4 md:mb-5">
      <div className="relative w-[30%] sm:w-1/3">
        <Image
          src={imgSrc}
          alt={property.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc("/placeholder.jpg")}
        />
        <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 flex justify-center items-center gap-0.5 sm:gap-1 flex-col">
          {property.isPetsAllowed && (
            <span className="bg-white/80 text-black text-[8px] sm:text-[10px] md:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full w-fit">
              Pets
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="bg-white/80 text-black text-[8px] sm:text-[10px] md:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full">
              Parking
            </span>
          )}
        </div>
      </div>
      <div className="w-[70%] sm:w-2/3 p-3 sm:p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h2 className="text-sm sm:text-base md:text-lg font-bold line-clamp-1 flex-1">
              {propertyLink ? (
                <Link
                  href={propertyLink}
                  className="hover:underline hover:text-blue-600"
                  scroll={false}
                >
                  {property.name}
                </Link>
              ) : (
                property.name
              )}
            </h2>
            {showFavoriteButton && (
              <button
                className="bg-white rounded-full p-0.5 flex-shrink-0"
                onClick={onFavoriteToggle}
              >
                <Heart
                  className={`w-4 h-4 sm:w-4 sm:h-4 ${
                    isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
                  }`}
                />
              </button>
            )}
          </div>
          <p className="text-gray-600 text-[11px] sm:text-xs md:text-sm line-clamp-1 mt-0.5">
            {property?.location?.address}, {property?.location?.city}
          </p>
          <div className="flex text-[11px] sm:text-xs md:text-sm items-center mt-1">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 mr-0.5" />
            <span className="font-semibold">
              {property.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600 ml-1">
              ({property.numberOfReviews})
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center text-[11px] sm:text-xs md:text-sm">
          <div className="flex gap-2 sm:gap-3 text-gray-600 font-semibold">
            <span className="flex items-center">
              <Bed className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              {property.beds}
            </span>
            <span className="flex items-center">
              <Bath className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              {property.baths}
            </span>
            <span className="flex items-center">
              <House className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              {property.squareFeet}
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold">
            ₹{property.pricePerMonth.toFixed(0)}
            <span className="text-gray-600 text-[9px] sm:text-xs font-normal"> /mo</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardCompact;
