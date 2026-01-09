import StaticPageWrapper from "@/components/StaticPageWrapper";

export default function FAQPage() {
  return (
    <StaticPageWrapper title="Frequently Asked Questions">
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-gray-900">
            Is Habiful a broker or agent?
          </h3>
          <p>
            No. Habiful is not a real estate broker, agent, or property owner.
            It operates solely as a technology platform.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900">
            Are listings guaranteed to be accurate?
          </h3>
          <p>
            Property information is provided by third parties. While accuracy is
            encouraged, Habiful does not guarantee availability, pricing, or
            completeness.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900">
            Does Habiful participate in rental transactions?
          </h3>
          <p>
            No. All rental agreements are made directly between users and
            property owners or managers.
          </p>
        </div>
      </div>
    </StaticPageWrapper>
  );
}
