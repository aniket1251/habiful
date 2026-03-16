import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useGetPropertyQuery } from "@/state/api";
import { Compass, MapPin } from "lucide-react";

const PropertyLocation = ({ property }: PropertyLocationProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!property?.location?.coordinates) return;
    
    // Set access token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
    
    if (!mapboxgl.accessToken) {
      console.error("Mapbox access token is not set");
      return;
    }

    // Clean up existing map
    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/aniket1251/cmj9y15sv003d01sa4s6ycs3x",
      center: [
        property.location.coordinates.longitude,
        property.location.coordinates.latitude,
      ],
      zoom: 14,
    });

    mapRef.current = map;

    const marker = new mapboxgl.Marker()
      .setLngLat([
        property.location.coordinates.longitude,
        property.location.coordinates.latitude,
      ])
      .addTo(map);

    const markerElement = marker.getElement();
    const path = markerElement.querySelector("path[fill='#3FB1CE']");
    if (path) path.setAttribute("fill", "#000000");

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [property?.location?.coordinates?.longitude, property?.location?.coordinates?.latitude]);
  return (
    <div className="py-8 sm:py-12 md:py-16">
      <h3 className="text-lg sm:text-xl font-semibold text-primary-800 dark:text-primary-100">
        Map and Location
      </h3>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-primary-500 mt-2 gap-2">
        <div className="flex items-center text-gray-500">
          <MapPin className="w-4 h-4 mr-1 text-gray-700 flex-shrink-0" />
          <span className="text-xs sm:text-sm">Property Address:</span>
          <span className="ml-2 font-semibold text-gray-700 text-xs sm:text-sm">
            {property.location?.address || "Address not available"}
          </span>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(
            property.location?.address || ""
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-between items-center hover:underline gap-2 text-primary-600"
        >
          <Compass className="w-5 h-5" />
          Get Directions
        </a>
      </div>
      <div
        className="relative mt-4 h-[200px] sm:h-[250px] md:h-[300px] rounded-lg overflow-hidden"
        ref={mapContainerRef}
      />
    </div>
  );
};

export default PropertyLocation;
