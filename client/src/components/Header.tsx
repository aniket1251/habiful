import React from "react";

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className="mb-4 sm:mb-5">
      <h1 className="text-lg sm:text-xl font-semibold">{title}</h1>
      <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{subtitle}</p>
    </div>
  );
};

export default Header;
