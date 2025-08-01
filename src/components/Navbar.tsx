"use client";

import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full px-6 py-4 bg-[#0d1117] text-white flex justify-between items-center border-b border-gray-800">
      <div className="text-2xl font-bold">TaskFi</div>

      <div className="hidden md:flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/services">Services</Link>
        <Link href="/contact">Contact</Link>
      </div>

      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#0d1117] flex flex-col items-center gap-4 py-4 border-t border-gray-800 md:hidden">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
