import StaticPageWrapper from "@/components/StaticPageWrapper";
import { Cookie, Settings, BarChart3 } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <StaticPageWrapper
      title="Cookie Policy"
      subtitle="How we use cookies and similar technologies on Habiful."
    >
      <p>
        Habiful uses cookies and similar technologies to ensure platform
        functionality and enhance your experience.
      </p>

      {/* Cookie Types */}
      <div className="space-y-3 sm:space-y-4 pt-2">
        <div className="flex gap-3 sm:gap-4 p-4 sm:p-5 bg-orange-50 rounded-xl">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-lg flex items-center justify-center">
            <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Essential Cookies</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Required for basic platform functionality like authentication and session management.</p>
          </div>
        </div>
        <div className="flex gap-3 sm:gap-4 p-4 sm:p-5 bg-blue-50 rounded-xl">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Preference Cookies</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Remember your preferences and settings for a personalized experience.</p>
          </div>
        </div>
        <div className="flex gap-3 sm:gap-4 p-4 sm:p-5 bg-green-50 rounded-xl">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Analytics Cookies</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Help us understand usage patterns to improve performance and reliability.</p>
          </div>
        </div>
      </div>

      <h2 className="pt-4 sm:pt-6 text-base sm:text-lg font-semibold text-gray-900">Managing Cookies</h2>
      <p>
        You can control and manage cookies through your browser settings. Disabling
        certain cookies may affect platform functionality.
      </p>

      <p className="pt-4 text-xs sm:text-sm text-gray-400">
        By continuing to use the platform, you consent to the use of cookies as
        described in this policy. Last updated: February 2026
      </p>
    </StaticPageWrapper>
  );
}
