"use client"
import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const FooterSection = () => {
  return (
    <footer className="border-t border-gray-200 py-10 sm:py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:items-center">
          <div className="mb-0">
            <Link href="/" className="text-xl font-bold" scroll={false}>
              HABIFUL
            </Link>
          </div>
          <nav className="mb-0">
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-x-6">
              <li>
                <Link href="/about" className="text-sm sm:text-base hover:text-primary-600">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm sm:text-base hover:text-primary-600">Contact Us</Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm sm:text-base hover:text-primary-600">FAQ</Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm sm:text-base hover:text-primary-600">Terms</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm sm:text-base hover:text-primary-600">Privacy</Link>
              </li>
            </ul>
          </nav>
          <div className="flex space-x-4 mb-0">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-primary-600"
            >
              <FontAwesomeIcon icon={faFacebook} className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-primary-600"
            >
              <FontAwesomeIcon icon={faInstagram} className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-primary-600">
              <FontAwesomeIcon icon={faTwitter} className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
            <a
              href="#"
              aria-label="Linkedin"
              className="hover:text-primary-600"
            >
              <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
            <a href="#" aria-label="Youtube" className="hover:text-primary-600">
              <FontAwesomeIcon icon={faYoutube} className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 flex flex-wrap justify-center gap-x-3 gap-y-1 sm:gap-x-4">
          <span>© HABiful. All Rights Reserved.</span>
          <Link href="/privacy" className="hover:text-primary-600">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary-600">Terms of Service</Link>
          <Link href="/cookies" className="hover:text-primary-600">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;