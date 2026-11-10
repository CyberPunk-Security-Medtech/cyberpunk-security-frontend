"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/home/about-us" },
    { label: "Contact Us", href: "/home/contact-us" },
  ];

  return (
    <nav
      className={`fixed left-1/2 top-4 z-header flex w-[92%] max-w-6xl -translate-x-1/2 items-center justify-between rounded-full px-6 py-3 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-[#859DBD]/70 via-[#859DBD]/25 to-[#859DBD]/100 shadow-lg backdrop-blur-md"
          : "bg-white/70 backdrop-blur-md"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="PrivaCure" width={36} height={36} />
        <span className="text-xl font-semibold text-gray-900">PrivaCure</span>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-gray-700 font-medium hover:text-[#00A9B7] transition"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right-side buttons */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/auth/login"
          className="font-medium text-gray-700 transition hover:text-[#00A9B7]"
        >
          Sign in
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-md bg-gradient-to-r from-[#0040C1] to-[#00A9B7] px-5 py-2.5 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden flex items-center justify-center h-10 w-10 rounded-full border border-gray-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute top-[70px] left-0 w-full rounded-b-md bg-white/95 shadow-md p-6 md:hidden"
          >
            <div className="flex flex-col gap-4 text-gray-800 font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-[#00A9B7]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="hover:text-[#00A9B7]"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setIsOpen(false)}
                className="mt-2 rounded-md bg-gradient-to-r from-[#0040C1] to-[#00A9B7] px-5 py-2.5 text-center text-white font-semibold shadow-md"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}


// "use client";
// import Image from "next/image";
// import Link from "next/link";

// export default function Navbar() {
//   const links = ["Home", "About Us", "Book Now", "Contact Us"];

//   return (
//     <header className="flex justify-center mt-6 z-50 relative">
//       <nav className="flex w-[92%] max-w-6xl items-center justify-between rounded-md bg-gradient-to-r from-[#E6F2FF] to-[#DDF9F2] px-6 py-3 shadow-md">
//         <div className="flex items-center gap-2 rounded-md bg-[#E3EDF6] px-3 py-1.5">
//           <Image src="/icons/logo.svg" alt="PrivaCure" width={28} height={28} />
//           <span className="font-semibold text-gray-800">PrivaCure</span>
//         </div>

//         <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700">
//           {links.map((l) => (
//             <li key={l}>
//               <Link
//                 href="#"
//                 className={`hover:text-[#00A9B7] ${
//                   l === "Home" && "text-[#00A9B7]"
//                 }`}
//               >
//                 {l}
//               </Link>
//             </li>
//           ))}
//         </ul>

//         <div className="flex items-center gap-3">
//           <button className="h-9 w-9 flex items-center justify-center rounded-full bg-[#E3EDF6]">
//             <Image src="/icons/search.svg" alt="search" width={15} height={15} />
//           </button>
//           <button className="h-9 w-9 flex items-center justify-center rounded-full bg-[#E3EDF6]">
//             <Image src="/icons/user.svg" alt="user" width={15} height={15} />
//           </button>
//           <button className="rounded-md bg-gradient-to-r from-[#0040C1] to-[#00A9B7] px-5 py-2 text-white font-semibold text-sm">
//             Request Early Access
//           </button>
//         </div>
//       </nav>
//     </header>
//   );
// }
