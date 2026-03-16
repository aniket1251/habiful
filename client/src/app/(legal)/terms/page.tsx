import StaticPageWrapper from "@/components/StaticPageWrapper";

export default function TermsPage() {
  return (
    <StaticPageWrapper
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using Habiful."
    >
      <p>
        Habiful is provided on an &quot;as is&quot; and &quot;as available&quot;
        basis. By accessing or using the platform, you agree to be bound by these terms.
      </p>

      <div className="space-y-5 sm:space-y-6">
        <div className="border-l-4 border-primary-500 pl-4 sm:pl-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">1. Platform Use</h2>
          <p className="mt-1 sm:mt-2">
            Habiful provides rental discovery tools only and does not offer legal,
            financial, or real estate advice. Users are responsible for verifying
            all property information independently.
          </p>
        </div>

        <div className="border-l-4 border-secondary-500 pl-4 sm:pl-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">2. Third-Party Listings</h2>
          <p className="mt-1 sm:mt-2">
            Listings are submitted by third parties. Habiful does not verify or
            guarantee any property details, availability, or rental terms. Users
            should conduct their own due diligence.
          </p>
        </div>

        <div className="border-l-4 border-yellow-500 pl-4 sm:pl-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">3. User Accounts</h2>
          <p className="mt-1 sm:mt-2">
            You are responsible for maintaining the confidentiality of your account
            credentials. Any activity under your account is your responsibility.
          </p>
        </div>

        <div className="border-l-4 border-red-400 pl-4 sm:pl-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">4. Limitation of Liability</h2>
          <p className="mt-1 sm:mt-2">
            To the maximum extent permitted by law, Habiful shall not be liable for
            any direct, indirect, incidental, or consequential damages arising from
            the use of the platform.
          </p>
        </div>

        <div className="border-l-4 border-green-500 pl-4 sm:pl-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">5. Changes to Terms</h2>
          <p className="mt-1 sm:mt-2">
            We reserve the right to modify these terms at any time. Continued use of
            the platform after changes constitutes acceptance of the updated terms.
          </p>
        </div>
      </div>

      <p className="pt-4 text-xs sm:text-sm text-gray-400">
        Last updated: February 2026
      </p>
    </StaticPageWrapper>
  );
}
