import StaticPageWrapper from "@/components/StaticPageWrapper";

export default function ContactPage() {
  return (
    <StaticPageWrapper title="Contact Us">
      <p>
        If you have questions, concerns, or require assistance regarding the use
        of Habiful, our support team is available to help.
      </p>

      <div className="space-y-2">
        <p>
          <span className="font-medium text-gray-900">Email:</span>{" "}
          support@habiful.com
        </p>
        <p>
          <span className="font-medium text-gray-900">Business Hours:</span>{" "}
          Monday – Friday, 9:00 AM – 6:00 PM
        </p>
      </div>

      <p className="text-sm text-gray-500 pt-4">
        Response times may vary depending on request volume.
      </p>
    </StaticPageWrapper>
  );
}
