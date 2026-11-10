"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Check, Gift, Handshake } from "lucide-react";

const CONTACT_EMAIL = "privacuremedtech@gmail.com";

// There is no partner or referral endpoint yet, so both open a pre-filled
// email to the team.
const mailto = (subject: string, body: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const PARTNER_EMAIL = mailto(
  "Partnership enquiry",
  "Organisation name:\nType (HMO, lab, pharmacy, technology, other):\nContact person and role:\nPhone number:\n\nHow we'd like to work with PrivaCure:\n",
);

const REFERRAL_EMAIL = mailto(
  "Referral",
  "Your name:\nYour organisation (if on PrivaCure):\nYour phone number:\n\nOrganisation you're referring:\nTheir contact person and email/phone:\n",
);

const cards = [
  {
    id: "get-started",
    icon: Building2,
    title: "Start using PrivaCure",
    desc: "Register your hospital or clinic and set up your workspace in minutes.",
    points: ["Invite your doctors, nurses, lab and pharmacy staff", "Records, consultations and transfers in one place"],
    cta: { label: "Create your workspace", href: "/auth/signup", external: false },
    featured: true,
  },
  {
    id: "partner",
    icon: Handshake,
    title: "Partner with us",
    desc: "HMOs, labs, pharmacies and technology providers: connect your services to the care teams on PrivaCure.",
    points: ["Secure, consent-based data exchange", "A dedicated integration contact"],
    cta: { label: "Become a partner", href: PARTNER_EMAIL, external: true },
    featured: false,
  },
  {
    id: "refer",
    icon: Gift,
    title: "Refer and earn credit",
    desc: "Know a hospital, clinic or lab that should be on PrivaCure? Refer them and earn credit on your account.",
    points: ["Credit once they sign up and go live", "No limit on how many you refer"],
    cta: { label: "Refer an organisation", href: REFERRAL_EMAIL, external: true },
    featured: false,
  },
] as const;

export default function GetStarted() {
  return (
    <section id="get-started" className="relative scroll-mt-24 overflow-hidden px-4 py-20 sm:px-6 sm:py-24">
      <Image
        src="/vision-splash.svg"
        alt=""
        width={220}
        height={220}
        className="pointer-events-none absolute left-6 top-8 hidden opacity-40 sm:left-[12%] sm:block"
      />

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="px-2 text-2xl font-bold leading-snug text-[#0F1C2E] sm:text-[28px] md:text-[34px]"
        >
          PrivaCure is live. <span className="text-[#00A9B7]">Start today.</span>
        </motion.h2>
        <p className="mx-auto mt-3 max-w-2xl px-2 text-sm leading-relaxed text-[#4A5D6A] sm:text-base">
          Hospitals and clinics can sign up and start using the platform now. Partners and
          referrers help us bring connected, secure care to more patients.
        </p>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 text-left sm:mt-14 md:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = card.icon;
            const featured = card.featured;
            return (
              <motion.article
                key={card.id}
                id={card.id === "get-started" ? undefined : card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`flex scroll-mt-28 flex-col rounded-md p-6 shadow-sm transition hover:shadow-md sm:p-8 ${
                  featured ? "bg-[#000EA0] text-white" : "border border-[#DCE8F2] bg-white"
                }`}
              >
                <span
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-md ${
                    featured ? "bg-white/15 text-white" : "bg-[#E6F7F8] text-[#00A9B7]"
                  }`}
                >
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className={`mb-2 text-base font-semibold sm:text-lg ${featured ? "text-white" : "text-[#0F1C2E]"}`}>
                  {card.title}
                </h3>
                <p className={`text-[13px] leading-relaxed sm:text-[14px] ${featured ? "text-white/85" : "text-[#5B6C7C]"}`}>
                  {card.desc}
                </p>
                <ul className="mt-5 space-y-2">
                  {card.points.map((point) => (
                    <li
                      key={point}
                      className={`flex items-start gap-2 text-[13px] sm:text-[14px] ${featured ? "text-white/90" : "text-[#2F3E4C]"}`}
                    >
                      <Check
                        size={16}
                        className={`mt-0.5 shrink-0 ${featured ? "text-[#7FE3DA]" : "text-[#00A9B7]"}`}
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                {/* mt-auto keeps the buttons aligned across cards of different heights. */}
                <div className="mt-auto pt-7">
                  {card.cta.external ? (
                    <a
                      href={card.cta.href}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#00A9B7] px-5 py-3 text-sm font-semibold text-[#0F1C2E] transition hover:bg-[#00A9B710] sm:text-base"
                    >
                      {card.cta.label} <ArrowRight size={16} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link
                      href={card.cta.href}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#0040C1] transition hover:opacity-90 sm:text-base"
                    >
                      {card.cta.label} <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                  {featured && (
                    <p className="mt-3 text-center text-xs text-white/80">
                      Already registered?{" "}
                      <Link href="/auth/login" className="font-semibold text-white underline underline-offset-2">
                        Sign in
                      </Link>
                    </p>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
