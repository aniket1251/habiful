"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useGetAuthUserQuery } from "@/state/api";

const CallToActionSection = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const redirectPath =
    authUser?.userRole === "manager"
      ? "/managers/properties"
      : authUser?.userRole === "tenant"
      ? "/tenants/favorites"
      : "/signup";
  return (
    <div className="relative py-24">
      <Image
        src="/landing-call-to-action.jpg"
        alt="Rentiful Search Section Background"
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-4xl xl:max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 md:mr-10">
            <h2 className="text-2xl font-bold text-white">
              Discover a better way to rent
            </h2>
          </div>
          <div>
            <p className="text-white mb-3">
              Explore modern rental homes across locations that matter to you.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-block text-primary-700 bg-white rounded-lg px-6 py-3 font-semibold hover:bg-primary-500 hover:text-primary-50"
              >
                Search
              </button>
              <Link
                href={redirectPath}
                className="inline-block text-white bg-secondary-600 rounded-lg px-6 py-3 font-semibold hover:bg-secondary-500"
                scroll={false}
              >
                {authUser ? "Go to Dashboard" : "Get Stared"}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CallToActionSection;
