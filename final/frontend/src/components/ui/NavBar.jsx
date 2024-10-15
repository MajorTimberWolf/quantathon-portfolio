import React from "react";
import Link from "next/link";
import { TrendingUp, PieChart, Settings, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-[#131212] border-b border-[#2ea583] py-4 px-6 sticky top-0 z-10">
      <div className="w-full flex justify-between items-center">
        <Link
          href="/"
          className="text-[#2ea583] text-2xl font-bold flex items-center"
        >
          <TrendingUp className="mr-2" />
          <span>Portfolio Optimizer - Quantathon 2.0</span>
        </Link>

        <div className="flex space-x-6">
          <NavItem href="/" icon={<PieChart size={20} />} text="Get Started" />
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ href, icon, text }) => (
  <Link
    href={href}
    className="text-[#fefffe] hover:text-[#2ea583] transition-colors duration-200 flex items-center"
  >
    {icon}
    <span className="ml-1">{text}</span>
  </Link>
);

export default Navbar;
