"use client";
import ApplicationCard from "@/components/ApplicationCard";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetApplicationsQuery } from "@/state/api";
import { useAuth } from "@/app/(auth)/authProvider";
import { CircleCheckBig, Clock, Download, XCircle } from "lucide-react";
import React from "react";

const Applications = () => {
  const { user } = useAuth();
  const {
    data: applications,
    isLoading,
    isError,
  } = useGetApplicationsQuery({
    userId: user?.id,
    userType: "tenant",
  });

  if (isLoading) return <Loading />;
  if (isError || !applications) return <div>Error fetching applications</div>;

  return (
    <div className="dashboard-container">
      <Header title="Applications" subtitle="Track and manage your property rental applications" />
      <div className="w-full">
        {applications?.map((application) => (
          <ApplicationCard key={application.id} application={application} userType="renter">
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-5 w-full pb-4 px-3 sm:px-4">
              {application.status === "Approved" ? (
                <div className="bg-green-100 p-3 sm:p-4 text-green-700 grow flex items-center text-xs sm:text-sm rounded-lg">
                  <CircleCheckBig className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span>The property is being rented by you until {new Date(application.lease?.endDate).toLocaleDateString("en-GB")}</span>
                </div>
              ) : application.status === "Pending" ? (
                <div className="bg-yellow-100 p-3 sm:p-4 text-yellow-700 grow flex items-center text-xs sm:text-sm rounded-lg">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span>Your application is pending approval</span>
                </div>
              ) : (
                <div className="bg-red-100 p-3 sm:p-4 text-red-700 grow flex items-center text-xs sm:text-sm rounded-lg">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span>Your application has been denied</span>
                </div>
              )}
              <button className="bg-white border border-gray-300 text-gray-700 py-2 px-3 sm:px-4 text-xs sm:text-sm rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50 w-full sm:w-auto">
                <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />Download
              </button>
            </div>
          </ApplicationCard>
        ))}
      </div>
      {(!applications || applications.length === 0) && (
        <p className="text-sm sm:text-base text-gray-500">You don&lsquo;t have any applications</p>
      )}
    </div>
  );
};

export default Applications;
