"use client";

import StaticPageWrapper from "@/components/StaticPageWrapper";
import { Button } from "@/components/ui/button";
import { Clock, Mail, MapPin, Send } from "lucide-react";
import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // placeholder — no backend for contact form yet
    alert("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <StaticPageWrapper
      title="Contact Us"
      subtitle="Have a question or need help? We'd love to hear from you."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Contact Info */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex gap-3 sm:gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Email</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">support@habiful.com</p>
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Business Hours</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Monday – Friday, 9:00 AM – 6:00 PM</p>
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Location</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Bengaluru, Karnataka, India</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 pt-2">
            Response times may vary depending on request volume.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none"
              placeholder="How can we help?"
            />
          </div>
          <Button type="submit" className="w-full bg-primary-700 text-white hover:bg-primary-600 text-xs sm:text-sm h-9 sm:h-10">
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </form>
      </div>
    </StaticPageWrapper>
  );
}
