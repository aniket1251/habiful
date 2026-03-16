import { useGetPropertyQuery } from "@/state/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const ImagePreviews = ({ images }: ImagePreviewsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = images.length;
  const handlePrev = () => {
    if (totalImages <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNext = () => {
    if (totalImages <= 1) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] xl:h-[550px] w-full">
      {images.map((image: string, index: number) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt={`Property Image ${index + 1}`}
            fill
            priority={index == 0}
            className="object-cover cursor-pointer transition-transform duration-500 ease-in-out"
          />
        </div>
      ))}
      <button
        onClick={handlePrev}
        disabled={totalImages <= 1}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-primary-700 bg-opacity-50 p-2 sm:p-3 rounded-full focus:outline-none focus:ring focus:ring-secondary-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-opacity-70 transition-all"
        aria-label="Previous Image"
      >
        <ChevronLeft className="text-white w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={handleNext}
        disabled={totalImages <= 1}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-primary-700 bg-opacity-50 p-2 sm:p-3 rounded-full focus:outline-none focus:ring focus:ring-secondary-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-opacity-70 transition-all"
        aria-label="Next Image"
      >
        <ChevronRight className="text-white w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      {/* Image indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
              index === currentImageIndex
                ? "bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImagePreviews;
