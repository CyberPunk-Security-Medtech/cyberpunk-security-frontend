"use client";

import Footer from "components/home/FooterSection";
import Hero from "components/home/Hero";
import Features from "components/home/Features";
import Vision from "components/home/Vision";
import Process from "components/home/Process";
import Testimonials from "components/home/Testimonials";
import CTASection from "components/home/CTASection";
import Appointment from "components/home/Appointment";
import FAQ from "components/home/FAQ";
import Navbar from "@components/home/Navbar";
import WhatsPrivaCure from "@components/home/WhatsPrivaCure";
import FutureHealthcare from "@components/home/FutureHealthCare";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden relative">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="w-full overflow-x-hidden">
        <Hero />
        <Features />
        <WhatsPrivaCure />
        <Vision />
        <Process />
        <Testimonials />
        <CTASection />
        <FutureHealthcare />
        {/* <Appointment /> */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
