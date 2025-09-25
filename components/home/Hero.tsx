"use client";

import React from "react";
import HeroPartnersCard from "./HeroPartnersCard";


export default function HeroSection() {
    return (
        <header className="relative bg-[url('/bg_img.jpg')] bg-center bg-cover">
            <div className="absolute inset-0 bg-white/60"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-28">
                <div className="flex justify-center mb-8">
                    <img src="/auth_logo.svg" alt="PrivaCure" className="h-12 w-auto" />
                </div>


                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
                        Building Africa’s Most Trusted <br />
                        <span className="text-primary-600">Healthcare Data</span>{" "}
                        Infrastructure
                    </h1>

                    <p className="mt-6 text-gray-600 text-lg md:text-xl">
                        Privacure combines cutting-edge technology with healthcare expertise to deliver a
                        comprehensive platform that addresses Africa’s unique healthcare challenges.
                    </p>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <a
                            href="#signup"
                            className="inline-flex items-center gap-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full px-6 py-3 shadow"
                        >
                            Join the Waitlist
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>

                        <a
                            href="#signup"
                            className="inline-flex items-center gap-3 bg-white border border-gray-200 text-gray-800 font-semibold rounded-full px-6 py-3"
                        >
                            Request Early Access
                        </a>
                    </div>
                </div>


                <div className="mt-12">
                    <HeroPartnersCard />
                </div>
            </div>
        </header>
    );
}
