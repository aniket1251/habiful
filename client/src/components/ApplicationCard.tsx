"use client";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const ApplicationCard = ({
  application,
  userType,
  children,
}: ApplicationCardProps) => {
  const [imgSrc, setImgSrc] = useState(
    application.property.photoUrls?.[0] || "/placeholder.jpg"
  );

  const statusColor =
    application.status === "Approved"
      ? "bg-green-500"
      : application.status === "Denied"
      ? "bg-red-500"
      : "bg-yellow-500";

  const contactPerson =
    userType === "manager" ? application.tenant : application.manager;

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-white mb-3 sm:mb-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 gap-4 sm:gap-5 lg:gap-4">
        {/* Property Info Section */}
        <div className="flex flex-col sm:flex-row lg:flex-row gap-3 sm:gap-4 lg:gap-5 w-full lg:w-auto">
          <Image
            src={imgSrc}
            alt={application.property.name}
            width={200}
            height={150}
            className="rounded-xl object-cover w-full sm:w-[160px] lg:w-[200px] h-[120px] sm:h-[130px] lg:h-[150px]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc("/placeholder.jpg")}
          />
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold my-1 sm:my-2 line-clamp-1">
                {application.property.name}
              </h2>
              <div className="flex items-center mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{`${application.property.location.city}, ${application.property.location.country}`}</span>
              </div>
            </div>
            <div className="text-base sm:text-lg lg:text-xl font-semibold">
              ₹{application.property.pricePerMonth}{" "}
              <span className="text-xs sm:text-sm font-normal">/ month</span>
            </div>
          </div>
        </div>

        {/* Divider - visible only on desktop */}
        <div className="hidden lg:block border-[0.5px] border-primary-200 h-48" />

        {/* Status Section */}
        <div className="flex flex-col justify-between w-full lg:basis-2/12 lg:h-48 py-1 sm:py-2 gap-2 sm:gap-3 lg:gap-0 text-xs sm:text-sm lg:text-base">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Status:</span>
              <span
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 ${statusColor} text-white rounded-full text-[10px] sm:text-xs lg:text-sm`}
              >
                {application.status}
              </span>
            </div>
            <hr className="mt-2 sm:mt-3" />
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Start Date:</span>{" "}
            {application.lease?.startDate
              ? new Date(application.lease?.startDate).toLocaleDateString(
                  "en-GB"
                )
              : "Due"}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">End Date:</span>{" "}
            {application.lease?.endDate
              ? new Date(application.lease?.endDate).toLocaleDateString("en-GB")
              : "Due"}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Next Payment:</span>{" "}
            {application.lease?.nextPaymentDate
              ? new Date(application.lease?.nextPaymentDate).toLocaleDateString(
                  "en-GB"
                )
              : "Due"}
          </div>
        </div>

        {/* Divider - visible only on desktop */}
        <div className="hidden lg:block border-[0.5px] border-primary-200 h-48" />

        {/* Contact Person Section */}
        <div className="flex flex-col justify-start gap-3 sm:gap-4 lg:gap-5 w-full lg:basis-3/12 lg:h-48 py-1 sm:py-2">
          <div>
            <div className="text-sm sm:text-base lg:text-lg font-semibold">
              {userType === "manager" ? "Tenant" : "Manager"}
            </div>
            <hr className="mt-2 sm:mt-3" />
          </div>
          <div className="flex gap-3 sm:gap-4">
            <div>
              <Image
                src="/profileImg.png"
                alt={contactPerson?.name}
                width={40}
                height={40}
                className="rounded-full mr-1 sm:mr-2 w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]"
              />
            </div>
            <div className="flex flex-col gap-1 sm:gap-2">
              <div className="font-semibold text-sm sm:text-base">{contactPerson?.name}</div>
              <div className="text-xs sm:text-sm flex items-center text-primary-600">
                <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="truncate">{contactPerson?.phoneNumber}</span>
              </div>
              <div className="text-xs sm:text-sm flex items-center text-primary-600">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="truncate max-w-[150px] sm:max-w-none">{contactPerson?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-2 sm:my-3 lg:my-4" />
      {children}
    </div>
  );
};

export default ApplicationCard;
