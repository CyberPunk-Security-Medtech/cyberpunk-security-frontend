"use client";

import Footer from "components/home/FooterSection";
import Hero from "components/home/Hero";
import DashboardDemo from "components/home/DashboardDemo";
import Features from "components/home/Features";
import Vision from "components/home/Vision";
import Process from "components/home/Process";
import Testimonials from "components/home/Testimonials";
import Appointment from "components/home/Appointment";
import FAQ from "components/home/FAQ";
import Navbar from "@components/home/Navbar";
import WhatsPrivaCure from "@components/home/WhatsPrivaCure";
import GetStarted from "@components/home/GetStarted";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden relative">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="w-full overflow-x-hidden">
        <Hero />
        {/* <DashboardDemo /> */}
        <Features />
        <WhatsPrivaCure />
        <Vision />
        <Process />
        <Testimonials />
        <GetStarted />
        {/* <Appointment /> */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
