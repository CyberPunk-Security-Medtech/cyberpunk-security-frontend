"use client";

import ComparisonSection from "@components/home/ComparisonSection";
import { FeaturesSection } from "@components/home/Features";
import Footer from "@components/home/FooterSection";
import HeroSection from "@components/home/Hero";
import ProblemSection from "@components/home/ProblemSection";
import PurpleSignupCTA from "@components/home/PurpleSignupCTA";
import SolutionSection from "@components/home/SolutionSection";
import VisionSection from "@components/home/VisionSection";



export default function Home() {
    return (
        <div className="antialiased text-sans overflow-x-hidden">
            <HeroSection />
            <ProblemSection />
            <SolutionSection />
            <FeaturesSection />
            <ComparisonSection />
            <VisionSection />
            <PurpleSignupCTA />
            <Footer />
        </div>
    );
}
