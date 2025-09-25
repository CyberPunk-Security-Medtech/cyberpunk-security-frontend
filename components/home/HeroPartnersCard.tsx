"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroPartnersCard() {
    const partners = [
        { label: "Hospital", img: "/hospital.jpeg", href: "/#" },
        { label: "HMOs", img: "/hmo.jpeg", href: "/#" },
        { label: "Labs", img: "/labs.jpeg", href: "/#" },
        { label: "Patients", img: "/patient.jpeg", href: "/#" },
    ];

    return (
        <div className="mx-auto max-w-3xl -mt-8">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-6 py-6">
                <div className="flex items-center justify-between space-x-4">
                    <div className="flex gap-6 justify-center w-full">
                        {partners.map((partner, i) => (
                            <Link
                                key={i}
                                href={partner.href}
                                className="flex flex-col items-center space-y-2 group"
                            >
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden transition-transform duration-300 ease-out group-hover:scale-110 group-hover:shadow-lg relative">
                                    <Image
                                        src={partner.img}
                                        alt={partner.label}
                                        // width={60}
                                        // height={100}
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>


                                <div className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                                    {partner.label}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}