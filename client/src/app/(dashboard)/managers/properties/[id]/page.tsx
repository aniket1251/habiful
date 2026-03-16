"use client";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetPaymentsQuery,
  useGetPropertyLeasesQuery,
  useGetPropertyQuery,
} from "@/state/api";
import { ArrowDownToLine, ArrowLeft, Check, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const PropertyTenants = () => {
  const { id } = useParams();
  const propertyId = Number(id);

  const { data: property, isLoading: propertyLoading } =
    useGetPropertyQuery(propertyId);
  const { data: leases, isLoading: leasesLoading } =
    useGetPropertyLeasesQuery(propertyId);
  const { data: payments, isLoading: paymentsLoading } =
    useGetPaymentsQuery(propertyId);

  if (propertyLoading || leasesLoading || paymentsLoading) return <Loading />;

  const getCurrentMonthPaymentStatus = (leaseId: number) => {
    const currentDate = new Date();
    const currentMonthPayment = payments?.find(
      (payment) =>
        payment.leaseId === leaseId &&
        new Date(payment.dueDate).getMonth() === currentDate.getMonth() &&
        new Date(payment.dueDate).getFullYear() === currentDate.getFullYear()
    );
    return currentMonthPayment?.paymentStatus || "Not Paid";
  };

  return (
    <div className="dashboard-container">
      {/* Back to properties page */}
      <Link
        href="/managers/properties"
        className="flex items-center mb-3 sm:mb-4 hover:text-primary-500 text-sm sm:text-base"
        scroll={false}
      >
        <ArrowLeft className="w-4 h-4 mr-1.5 sm:mr-2" />
        <span>Back to Properties</span>
      </Link>

      <Header
        title={property?.name || "My Property"}
        subtitle="Manage tenants and leases for this property"
      />

      <div className="w-full space-y-4 sm:space-y-6">
        <div className="mt-4 sm:mt-8 bg-white rounded-xl shadow-md overflow-hidden p-3 sm:p-4 md:p-6">
          <div className="flex justify-between items-center gap-3 mb-4">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1">Tenants Overview</h2>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Manage and view all tenants for this property.
              </p>
            </div>
            <div>
              <button
                className={`bg-white border border-gray-300 text-gray-700 py-2
                px-3 sm:px-4 text-xs sm:text-sm rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50 whitespace-nowrap`}
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                <span>Download All</span>
              </button>
            </div>
          </div>
          <hr className="hidden sm:block mt-3 sm:mt-4 mb-1" />

          {/* Mobile: Card layout */}
          <div className="sm:hidden flex flex-col gap-3 mt-3">
            {leases?.map((lease) => (
              <div key={lease.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/profileImg.png"
                      alt={lease.tenant.name}
                      width={36}
                      height={36}
                      className="rounded-full w-9 h-9"
                    />
                    <div>
                      <div className="font-semibold text-sm">{lease.tenant.name}</div>
                      <div className="text-[11px] text-gray-500 truncate max-w-[140px]">{lease.tenant.email}</div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      getCurrentMonthPaymentStatus(lease.id) === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {getCurrentMonthPaymentStatus(lease.id) === "Paid" && (
                      <Check className="w-3 h-3 inline-block mr-0.5" />
                    )}
                    {getCurrentMonthPaymentStatus(lease.id)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-1 text-xs text-gray-600">
                  <span className="text-gray-400">Lease</span>
                  <span>{new Date(lease.startDate).toLocaleDateString("en-GB")} - {new Date(lease.endDate).toLocaleDateString("en-GB")}</span>
                  <span className="text-gray-400">Rent</span>
                  <span className="font-semibold text-gray-800">₹{lease.rent.toFixed(2)}</span>
                  <span className="text-gray-400">Phone</span>
                  <span>{lease.tenant.phoneNumber}</span>
                </div>
                <button
                  className="w-full border border-gray-300 text-gray-700 py-1.5 text-xs rounded-md flex items-center justify-center font-semibold hover:bg-primary-700 hover:text-primary-50 mt-1"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5 mr-1" />
                  Download Agreement
                </button>
              </div>
            ))}
          </div>

          {/* Desktop: Table layout */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Tenant</TableHead>
                  <TableHead className="text-xs sm:text-sm">Lease Period</TableHead>
                  <TableHead className="text-xs sm:text-sm">Monthly Rent</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">Contact</TableHead>
                  <TableHead className="text-xs sm:text-sm">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leases?.map((lease) => (
                  <TableRow key={lease.id} className="h-16 sm:h-20 md:h-24">
                    <TableCell>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Image
                          src="/profileImg.png"
                          alt={lease.tenant.name}
                          width={40}
                          height={40}
                          className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
                        />
                        <div>
                          <div className="font-semibold text-xs sm:text-sm">
                            {lease.tenant.name}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[100px] sm:max-w-none">
                            {lease.tenant.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <div>
                        {new Date(lease.startDate).toLocaleDateString("en-GB")}{" "}
                        -
                      </div>
                      <div>
                        {new Date(lease.endDate).toLocaleDateString("en-GB")}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">₹{lease.rent.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                          getCurrentMonthPaymentStatus(lease.id) === "Paid"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-red-100 text-red-800 border-red-300"
                        }`}
                      >
                        {getCurrentMonthPaymentStatus(lease.id) === "Paid" && (
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-0.5 sm:mr-1" />
                        )}
                        {getCurrentMonthPaymentStatus(lease.id)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{lease.tenant.phoneNumber}</TableCell>
                    <TableCell>
                      <button
                        className={`border border-gray-300 text-gray-700 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm rounded-md flex 
                        items-center justify-center font-semibold hover:bg-primary-700 hover:text-primary-50 whitespace-nowrap`}
                      >
                        <ArrowDownToLine className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                        Download
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyTenants;
