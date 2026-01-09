import StaticPageWrapper from "@/components/StaticPageWrapper";

export default function TermsPage() {
  return (
    <StaticPageWrapper title="Terms & Conditions">
      <p>
        Habiful is provided on an &quot;as is&quot; and &quot;as available&quot;
        basis. By using the platform, you agree to these terms.
      </p>

      <h2 className="pt-6 text-lg font-medium text-gray-900">Platform Use</h2>
      <p>
        Habiful provides rental discovery tools only and does not offer legal,
        financial, or real estate advice.
      </p>

      <h2 className="pt-6 text-lg font-medium text-gray-900">
        Third-Party Listings
      </h2>
      <p>
        Listings are submitted by third parties. Habiful does not verify or
        guarantee any property details, availability, or rental terms.
      </p>

      <h2 className="pt-6 text-lg font-medium text-gray-900">
        Limitation of Liability
      </h2>
      <p>
        To the maximum extent permitted by law, Habiful shall not be liable for
        any damages arising from the use of the platform.
      </p>
    </StaticPageWrapper>
  );
}
