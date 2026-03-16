"use client";

import StaticPageWrapper from "@/components/StaticPageWrapper";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const faqs = [
  {
    q: "Is Habiful a broker or agent?",
    a: "No. Habiful is not a real estate broker, agent, or property owner. It operates solely as a technology platform that connects renters with property listings.",
  },
  {
    q: "Are listings guaranteed to be accurate?",
    a: "Property information is provided by third parties. While accuracy is encouraged, Habiful does not guarantee availability, pricing, or completeness of any listing.",
  },
  {
    q: "Does Habiful participate in rental transactions?",
    a: "No. All rental agreements are made directly between users and property owners or managers. Habiful facilitates discovery only.",
  },
  {
    q: "How do I list my property on Habiful?",
    a: "Sign up as a Manager, then use the 'Add New Property' feature from your dashboard to create a listing with photos, amenities, and pricing details.",
  },
  {
    q: "Is my personal data safe?",
    a: "We take data security seriously. Your information is protected using industry-standard measures. See our Privacy Policy for full details.",
  },
  {
    q: "Can I save properties I like?",
    a: "Yes! Sign in as a Tenant and use the heart icon on any property card to save it to your Favorites for easy access later.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <StaticPageWrapper
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about using Habiful."
    >
      <div className="space-y-3 sm:space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-xl overflow-hidden transition-colors hover:border-primary-300"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 text-left bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900 text-sm sm:text-base pr-4">{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                  openIndex === idx ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === idx && (
              <div className="px-4 sm:px-5 pb-3 sm:pb-4 text-gray-600 text-xs sm:text-sm leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </StaticPageWrapper>
  );
}
