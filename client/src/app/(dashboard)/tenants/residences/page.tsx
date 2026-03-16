"use client";
import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetCurrentResidencesQuery, useGetTenantQuery } from "@/state/api";
import { useAuth } from "@/app/(auth)/authProvider";
import React from "react";

const Residences = () => {
  const { user } = useAuth();
  const { data: tenant } = useGetTenantQuery(user?.id || 0, { skip: !user?.id });

  const {
    data: currentResidences,
    isLoading,
    isError,
  } = useGetCurrentResidencesQuery(user?.id || 0, { skip: !user?.id });

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading current residences</div>;

  return (
    <div className="dashboard-container">
      <Header title="Current Residences" subtitle="View and manage your current living spaces" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {currentResidences?.map((property, idx) => (
          <Card key={idx} property={property}
            isFavorite={tenant?.favorites.includes(property?.id) || false}
            onFavoriteToggle={() => {}} showFavoriteButton={false}
            propertyLink={`/tenants/residences/${property?.id}`} />
        ))}
      </div>
      {(!currentResidences || currentResidences.length === 0) && (
        <p className="text-sm sm:text-base text-gray-500">You don&lsquo;t have any current residences</p>
      )}
    </div>
  );
};

export default Residences;
