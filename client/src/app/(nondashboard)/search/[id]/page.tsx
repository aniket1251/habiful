"use client";
import { useParams } from "next/navigation";
import React from "react";
import SingleListing from "./SingleListing";

const SingleSearchPage = () => {
  const { id } = useParams();
  const propertyId = Number(id);
  return (
    <div>
      <SingleListing key={propertyId} propertyId={propertyId} />
    </div>
  );
};

export default SingleSearchPage;
