"use client";
import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetPropertiesQuery, useGetTenantQuery } from "@/state/api";
import { useAuth } from "@/app/(auth)/authProvider";
import React from "react";

const Favorites = () => {
  const { user } = useAuth();
  const { data: tenant } = useGetTenantQuery(user?.id || 0, {
    skip: !user?.id,
  });

  const {
    data: favoriteProperties,
    isLoading,
    error,
  } = useGetPropertiesQuery(
    { favoriteIds: tenant?.favorites?.map((fav: { id: number }) => fav.id) },
    { skip: !tenant?.favorites || tenant?.favorites.length === 0 }
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading favorites</div>;

  return (
    <div className="dashboard-container">
      <Header title="Favorite Properties" subtitle="Browse and manage your saved property listings" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {favoriteProperties?.map((property) => (
          <Card key={property.id} property={property} isFavorite={true} onFavoriteToggle={() => {}}
            showFavoriteButton={false} propertyLink={`/search/${property.id}`} />
        ))}
      </div>
      {(!favoriteProperties || favoriteProperties.length === 0) && (
        <p className="text-sm sm:text-base text-gray-500">You don&lsquo;t have any favorite properties</p>
      )}
    </div>
  );
};

export default Favorites;
