'use client'

import Navbar from "@components/home/Navbar";
import Footer from "@components/home/FooterSection";
import ContactSection from "@components/home/ContactUs/ContactSection";

export default function ContactUsPage() {
  return (
<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#15BDB0]/20 via-[#F8FCFF]/40 to-white">
      <Navbar />
            <main className="pt-24 md:pt-28">
      <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
