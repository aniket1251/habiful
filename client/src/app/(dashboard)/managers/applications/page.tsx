"use client";
import ApplicationCard from "@/components/ApplicationCard";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetApplicationsQuery, useUpdateApplicationStatusMutation } from "@/state/api";
import { useAuth } from "@/app/(auth)/authProvider";
import { CircleCheckBig, Download, File, Hospital } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Applications = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const { data: applications, isLoading, isError } = useGetApplicationsQuery(
    { userId: user?.id, userType: "manager" },
    { skip: !user?.id }
  );
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();

  const handleStatusChange = async (id: number, status: string) => {
    await updateApplicationStatus({ id, status });
  };

  if (isLoading) return <Loading />;
  if (isError || !applications) return <div>Error fetching applications</div>;

  const filteredApplications = applications?.filter((application) => {
    if (activeTab === "all") return true;
    return application.status.toLowerCase() === activeTab;
  });

  return (
    <div className="dashboard-container">
      <Header title="Applications" subtitle="View and manage applications for your properties" />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full my-5">
        <TabsList className="grid w-full grid-cols-4 text-xs sm:text-sm">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="denied">Denied</TabsTrigger>
        </TabsList>
        {["all", "pending", "approved", "denied"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-5 w-full">
            {filteredApplications
              .filter((app) => tab === "all" || app.status.toLowerCase() === tab)
              .map((application) => (
                <ApplicationCard key={application.id} application={application} userType="manager">
                  <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-5 w-full pb-4 px-3 sm:px-4">
                    <div className={`p-3 sm:p-4 grow rounded-lg text-xs sm:text-sm ${
                      application.status === "Approved" ? "bg-green-100 text-green-700"
                        : application.status === "Denied" ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      <div className="flex flex-wrap items-center">
                        <File className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                        <span className="mr-1.5 sm:mr-2">Submitted {new Date(application.applicationDate).toLocaleDateString("en-GB")}</span>
                        <CircleCheckBig className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                        <span className={`font-semibold ${
                          application.status === "Approved" ? "text-green-800"
                            : application.status === "Denied" ? "text-red-800" : "text-yellow-800"
                        }`}>
                          {application.status === "Approved" && "Approved"}
                          {application.status === "Denied" && "Denied"}
                          {application.status === "Pending" && "Pending review"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <Link href={`/managers/properties/${application.property.id}`}
                        className="flex-1 sm:flex-none bg-white border border-gray-300 text-gray-700 py-2 px-3 sm:px-4 text-xs sm:text-sm rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50"
                        scroll={false}>
                        <Hospital className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />Details
                      </Link>
                      {application.status === "Approved" && (
                        <button className="flex-1 sm:flex-none bg-white border border-gray-300 text-gray-700 py-2 px-3 sm:px-4 text-xs sm:text-sm rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50">
                          <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />Download
                        </button>
                      )}
                      {application.status === "Pending" && (
                        <>
                          <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-white bg-green-600 rounded hover:bg-green-500"
                            onClick={() => handleStatusChange(application.id, "Approved")}>Approve</button>
                          <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-white bg-red-600 rounded hover:bg-red-500"
                            onClick={() => handleStatusChange(application.id, "Denied")}>Deny</button>
                        </>
                      )}
                      {application.status === "Denied" && (
                        <button className="flex-1 sm:flex-none bg-gray-800 text-white py-2 px-3 sm:px-4 text-xs sm:text-sm rounded-md flex items-center justify-center hover:bg-secondary-500 hover:text-primary-50">
                          Contact
                        </button>
                      )}
                    </div>
                  </div>
                </ApplicationCard>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Applications;
