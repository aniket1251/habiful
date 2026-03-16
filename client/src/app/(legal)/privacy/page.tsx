import StaticPageWrapper from "@/components/StaticPageWrapper";
import { Database, Lock, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <StaticPageWrapper
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information."
    >
      <p>
        We respect your privacy and are committed to protecting personal
        information collected through Habiful. This policy outlines our practices.
      </p>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
        <div className="flex flex-col items-center text-center p-4 sm:p-5 bg-primary-50 rounded-xl">
          <Database className="w-7 h-7 sm:w-8 sm:h-8 text-primary-700 mb-2" />
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">What We Collect</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Account info, search data, and usage analytics.</p>
        </div>
        <div className="flex flex-col items-center text-center p-4 sm:p-5 bg-green-50 rounded-xl">
          <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-green-700 mb-2" />
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">How We Use It</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">To operate, maintain, and improve the platform.</p>
        </div>
        <div className="flex flex-col items-center text-center p-4 sm:p-5 bg-blue-50 rounded-xl">
          <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-blue-700 mb-2" />
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Your Protection</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Industry-standard security. We never sell your data.</p>
        </div>
      </div>

      <h2 className="pt-4 sm:pt-6 text-base sm:text-lg font-semibold text-gray-900">Information We Collect</h2>
      <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
        <li>Account and profile information (name, email, phone)</li>
        <li>Search queries and interaction data</li>
        <li>Technical and usage analytics (device, browser, IP)</li>
      </ul>

      <h2 className="pt-4 sm:pt-6 text-base sm:text-lg font-semibold text-gray-900">Data Usage</h2>
      <p>
        Data is used solely to operate, maintain, and improve platform
        functionality. We do not sell personal data to third parties.
      </p>

      <h2 className="pt-4 sm:pt-6 text-base sm:text-lg font-semibold text-gray-900">Security</h2>
      <p>
        Reasonable security measures are used to protect your data. However, no method of
        electronic transmission or storage is 100% secure.
      </p>

      <p className="pt-4 text-xs sm:text-sm text-gray-400">
        Last updated: February 2026
      </p>
    </StaticPageWrapper>
  );
}
