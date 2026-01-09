import StaticPageWrapper from "@/components/StaticPageWrapper";

export default function CookiePolicyPage() {
  return (
    <StaticPageWrapper title="Cookie Policy">
      <p>
        Habiful uses cookies and similar technologies to ensure platform
        functionality and enhance user experience.
      </p>

      <h2 className="pt-6 text-lg font-medium text-gray-900">Cookie Usage</h2>
      <ul className="list-disc pl-5">
        <li>Remember preferences and sessions</li>
        <li>Analyze usage patterns</li>
        <li>Improve performance and reliability</li>
      </ul>

      <p className="pt-4 text-sm text-gray-500">
        By continuing to use the platform, you consent to the use of cookies.
        You may control cookies through your browser settings.
      </p>
    </StaticPageWrapper>
  );
}
