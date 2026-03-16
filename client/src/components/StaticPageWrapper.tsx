import { NAVBAR_HEIGHT } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const StaticPageWrapper = ({
  title,
  subtitle,
  children,
}: StaticPageProps) => {
  return (
    <section className="w-full min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-primary-700 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-primary-200 hover:text-white text-xs sm:text-sm mb-4 sm:mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{title}</h1>
          {subtitle && (
            <p className="mt-2 sm:mt-3 text-primary-200 text-sm sm:text-base md:text-lg max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 md:p-10">
          <div className="space-y-5 sm:space-y-6 text-gray-600 leading-relaxed text-sm sm:text-base">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaticPageWrapper;
