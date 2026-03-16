"use client";

import { useGetPropertyQuery } from "@/state/api";
import { useAuth } from "@/app/(auth)/authProvider";
import React, { useState } from "react";
import ImagePreviews from "./ImagePreviews";
import PropertyOverview from "./PropertyOverview";
import ContactWidget from "./ContactWidget";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import ApplicationModal from "./ApplicationModal";
import Loading from "@/components/Loading";

const SingleListing = ({ propertyId }: { propertyId: number }) => {
  const { user } = useAuth();
  const { data: property, isLoading, isError } = useGetPropertyQuery(propertyId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <Loading />;
  if (isError || !property) return <div>Error fetching property</div>;

  return (
    <div key={propertyId}>
      <ImagePreviews images={property.photoUrls?.length ? property.photoUrls : ["/singlelisting-2.jpg", "/singlelisting-3.jpg"]} isLoading isError />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12 lg:mt-16 mb-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <div className="order-2 lg:order-1 flex-1">
            <PropertyOverview property={property} />
            <PropertyDetails property={property} />
            <PropertyLocation property={property} />
          </div>
          <div className="order-1 lg:order-2 lg:w-[350px] flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <ContactWidget onOpenModal={() => setIsModalOpen(true)}
                phoneNumber={property.phoneNumber ? property.phoneNumber : "+911234567891"} isLoading isError />
            </div>
          </div>
        </div>
      </div>
      {user && <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} propertyId={property?.id} />}
    </div>
  );
};

export default SingleListing;
