import StaticPageWrapper from "@/components/StaticPageWrapper";

export default function PrivacyPage() {
  return (
    <StaticPageWrapper title="Privacy Policy">
      <p>
        We respect your privacy and are committed to protecting personal
        information collected through Habiful.
      </p>

      <h2 className="pt-6 text-lg font-medium text-gray-900">
        Information We Collect
      </h2>
      <ul className="list-disc pl-5">
        <li>Account and profile information</li>
        <li>Search and interaction data</li>
        <li>Technical and usage analytics</li>
      </ul>

      <h2 className="pt-6 text-lg font-medium text-gray-900">Data Usage</h2>
      <p>
        Data is used solely to operate, maintain, and improve platform
        functionality. We do not sell personal data.
      </p>

      <p className="pt-4 text-sm text-gray-500">
        Reasonable security measures are used; however, no method of
        transmission is completely secure.
      </p>
    </StaticPageWrapper>
  );
}
