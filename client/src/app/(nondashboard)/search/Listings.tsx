"use client";
import Card from "@/components/Card";
import CardCompact from "@/components/CardCompact";
import Loading from "@/components/Loading";
import {
  useAddFavoritePropertyMutation,
  useGetPropertiesQuery,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from "@/state/api";
import { useAuth } from "@/app/(auth)/authProvider";
import { useAppSelector } from "@/state/redux";
import { Property } from "@/types/prismaTypes";
import React from "react";

const Listings = () => {
  const { user } = useAuth();
  const { data: tenant } = useGetTenantQuery(user?.id || 0, {
    skip: !user?.id,
  });
  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const filters = useAppSelector((state) => state.global.filters);

  const { data: properties, isLoading, isError } = useGetPropertiesQuery(filters);

  const handleFavoriteToggle = async (propertyId: number) => {
    if (!user) return;
    const isFavorite = tenant?.favorites.some((fav: Property) => fav.id === propertyId);
    if (isFavorite) {
      await removeFavorite({ id: user.id, propertyId });
    } else {
      await addFavorite({ id: user.id, propertyId });
    }
  };

  if (isLoading) return <Loading />;
  if (isError || !properties) return <div>Unable to fetch properties</div>;

  return (
    <div className="w-full">
      <h3 className="text-sm px-4 font-bold">
        {properties.length}{" "}
        <span className="text-gray-700 font-normal">Places in {filters.location}</span>
      </h3>
      <div className="flex">
        <div className="p-4 w-full">
          {properties?.map((property, idx) =>
            viewMode === "grid" ? (
              <Card key={idx} property={property}
                isFavorite={tenant?.favorites.some((fav: Property) => fav.id === property.id) || false}
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                showFavoriteButton={!!user} propertyLink={`/search/${property.id}`} />
            ) : (
              <CardCompact key={idx} property={property}
                isFavorite={tenant?.favorites.some((fav: Property) => fav.id === property.id) || false}
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                showFavoriteButton={!!user} propertyLink={`/search/${property.id}`} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
