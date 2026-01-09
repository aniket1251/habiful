"use client";

import { useGetAuthUserQuery, useGetPropertyQuery } from "@/state/api";
import React, { useState } from "react";
import ImagePreviews from "./ImagePreviews";
import PropertyOverview from "./PropertyOverview";
import ContactWidget from "./ContactWidget";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import ApplicationModal from "./ApplicationModal";
import Loading from "@/components/Loading";

const SingleListing = ({ propertyId }: { propertyId: number }) => {
  const { data: authUser } = useGetAuthUserQuery();

  const {
    data: property,
    isLoading,
    isError,
  } = useGetPropertyQuery(propertyId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  if (isLoading) return <Loading />;
  if (isError || !property) return <div>Error fetching property</div>;
  return (
    <div key={propertyId}>
      <ImagePreviews
        images={
          property.photoUrls?.length
            ? property.photoUrls
            : ["/singlelisting-2.jpg", "/singlelisting-3.jpg"]
        }
        isLoading
        isError
      />
      <div className="flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8">
        <div className="order-2 md:order-1">
          <PropertyOverview property={property} />
          <PropertyDetails property={property} />
          <PropertyLocation property={property} />
        </div>
        <div className="order-1 md:order-2">
          <ContactWidget
            onOpenModal={() => setIsModalOpen(true)}
            phoneNumber={
              property.phoneNumber ? property.phoneNumber : "+911234567891"
            }
            isLoading
            isError
          />
        </div>
      </div>
      {authUser && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyId={property?.id}
        />
      )}
    </div>
  );
};

export default SingleListing;
