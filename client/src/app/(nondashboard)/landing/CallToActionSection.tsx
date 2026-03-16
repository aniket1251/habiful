"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/app/(auth)/authProvider";

const CallToActionSection = () => {
  const { user } = useAuth();
  const redirectPath =
    user?.role === "manager"
      ? "/managers/properties"
      : user?.role === "tenant"
      ? "/tenants/favorites"
      : "/signup";

  return (
    <div className="relative py-12 sm:py-16 md:py-24">
      <Image src="/landing-call-to-action.jpg" alt="Search Section Background" fill className="object-cover object-center" />
      <div className="absolute inset-0 bg-black/60"></div>
      <motion.div initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 sm:mb-6 md:mb-0 md:mr-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Discover a better way to rent</h2>
          </div>
          <div>
            <p className="text-white text-sm md:text-base lg:text-lg mb-3">Explore modern rental homes across locations that matter to you.</p>
            <div className="flex justify-center md:justify-start gap-2 sm:gap-3">
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-block text-primary-700 bg-white rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-xs sm:text-sm font-semibold hover:bg-primary-500 hover:text-primary-50">Search</button>
              <Link href={redirectPath}
                className="inline-flex items-center justify-center text-white bg-secondary-600 rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-xs sm:text-sm font-semibold hover:bg-secondary-500" scroll={false}>
                {user ? "Dashboard" : "Get Started"}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CallToActionSection;
