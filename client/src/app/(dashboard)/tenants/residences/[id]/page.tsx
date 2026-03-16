"use client";
import BillingHistory from "@/components/BillingHistory";
import Loading from "@/components/Loading";
import PaymentMethod from "@/components/PaymentMethod";
import ResidenceCard from "@/components/ResidenceCard";
import { useGetLeasesQuery, useGetPaymentsQuery, useGetPropertyQuery } from "@/state/api";
import { useAuth } from "@/app/(auth)/authProvider";
import { useParams } from "next/navigation";
import React from "react";

const Residence = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: property, isLoading: propertyLoading, error: propertyError } = useGetPropertyQuery(Number(id));
  const { data: leases, isLoading: leasesLoading } = useGetLeasesQuery(undefined as never, { skip: !user?.id });
  const { data: payments, isLoading: paymentsLoading } = useGetPaymentsQuery(leases?.[0]?.id || 0, { skip: !leases?.[0]?.id });

  if (propertyLoading || leasesLoading || paymentsLoading) return <Loading />;
  if (!property || propertyError) return <div>Error loading property</div>;

  const currentLease = leases?.find((lease) => lease.propertyId === property.id);

  return (
    <div className="dashboard-container">
      <div className="w-full mx-auto">
        <div className="md:flex gap-10">
          {currentLease && <ResidenceCard property={property} currentLease={currentLease} />}
          <PaymentMethod />
        </div>
        <BillingHistory payments={payments || []} />
      </div>
    </div>
  );
};

export default Residence;
