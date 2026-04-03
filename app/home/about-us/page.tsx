'use client'

import AboutIntro from "@components/home/AboutUs/AboutIntro";
import JourneyTimeline from "@components/home/AboutUs/JourneyTimeline";
import MissionVision from "@components/home/AboutUs/MissionVision";
import TeamSection from "@components/home/AboutUs/TeamSection";
import TeamValues from "@components/home/AboutUs/TeamValues";
import Appointment from "@components/home/Appointment";
import Footer from "@components/home/FooterSection";
import Navbar from "@components/home/Navbar";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <AboutIntro />
      <MissionVision />
      {/* <JourneyTimeline /> */}
      <TeamSection />
      <TeamValues />
      {/* <Appointment /> */}
      <Footer />
    </div>
  );
}
