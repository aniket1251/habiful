import React from "react";

const StaticPageWrapper = ({ title, children }: StaticPageProps) => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="mb-6 text-3xl font-semibold text-gray-900">{title}</h1>

        <div className="space-y-5 text-gray-600 leading-relaxed">
          {children}
        </div>
      </div>
    </section>
  );
};

export default StaticPageWrapper;
