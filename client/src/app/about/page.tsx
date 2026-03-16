import StaticPageWrapper from "@/components/StaticPageWrapper";
import { Building2, Eye, Heart, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <StaticPageWrapper
      title="About Habiful"
      subtitle="We're on a mission to make finding your next home simple, transparent, and enjoyable."
    >
      <p>
        Habiful is a digital platform designed to help users discover and
        explore rental properties based on their preferences and lifestyle
        needs. We believe everyone deserves a place that feels like home.
      </p>

      <p>
        We provide tools and information to support informed decision-making.
        Habiful does not own, manage, or lease properties listed on the
        platform.
      </p>

      {/* Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6">
        <div className="flex gap-3 sm:gap-4 p-4 sm:p-5 bg-primary-50 rounded-xl">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary-700 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Transparency</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Clear information to help you make confident decisions.</p>
          </div>
        </div>
        <div className="flex gap-3 sm:gap-4 p-4 sm:p-5 bg-secondary-50 rounded-xl">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-secondary-600 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Trust</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Building a reliable ecosystem for renters and managers.</p>
          </div>
        </div>
        <div className="flex gap-3 sm:gap-4 p-4 sm:p-5 bg-green-50 rounded-xl">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Community</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Connecting people with spaces that match their lifestyle.</p>
          </div>
        </div>
        <div className="flex gap-3 sm:gap-4 p-4 sm:p-5 bg-blue-50 rounded-xl">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Simplicity</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Reducing friction in the rental discovery process.</p>
          </div>
        </div>
      </div>

      <p className="pt-2">
        Our goal is to improve transparency and reduce friction in the rental
        discovery process while maintaining a reliable and respectful ecosystem
        for all users.
      </p>
    </StaticPageWrapper>
  );
}
