"use client";

import { ArrowLeftRight, GripHorizontal, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type PlatformScreenshot = {
  label: string;
  src: string;
};

const platformScreenshots: PlatformScreenshot[] = [
  { label: "Doctor dashboard", src: "/dashboard-demo/doctor-dashboard.png" },
  { label: "Admin dashboard", src: "/dashboard-demo/admin-dashboard.png" },
  { label: "Pharmacy inventory", src: "/dashboard-demo/pharmacy-inventory.png" },
  { label: "Patient records", src: "/dashboard-demo/patient-records.png" },
  { label: "Laboratory test order", src: "/dashboard-demo/lab-test-order.png" },
];

function ScreenshotCard({ screenshot, depth, onDismiss }: { screenshot: PlatformScreenshot; depth: number; onDismiss: () => void }) {
  const reduceMotion = useReducedMotion();
  const isTop = depth === 0;

  return (
    <motion.article
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.975 }}
      animate={{ opacity: 1 - depth * 0.14, y: depth * 18, scale: 1 - depth * 0.035, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      drag={isTop ? "x" : false}
      dragSnapToOrigin
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 64) onDismiss();
      }}
      style={{ zIndex: 10 - depth }}
      className={`absolute inset-x-0 bottom-12 top-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.13)] ${isTop ? "cursor-grab touch-pan-y active:cursor-grabbing" : "pointer-events-none"}`}
      aria-label={`${screenshot.label} platform screenshot`}
    >
      <div className="relative h-full overflow-hidden rounded-xl bg-slate-100">
        <Image src={screenshot.src} alt={screenshot.label} fill sizes="(max-width: 1024px) 100vw, 896px" className="pointer-events-none select-none object-contain" draggable={false} priority={isTop} />
      </div>
      <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between gap-3 bg-gradient-to-b from-slate-950/75 to-transparent p-3 text-white sm:p-4">
        <div className="flex items-center gap-2"><GripHorizontal size={17} aria-hidden="true" /><p className="text-sm font-semibold drop-shadow sm:text-base">{screenshot.label}</p></div>
        {isTop && <motion.span animate={reduceMotion ? undefined : { x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/65 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm sm:bottom-4 sm:left-4"><ArrowLeftRight size={13} />Drag to switch</motion.span>}
        {isTop && <button type="button" aria-label={`Move ${screenshot.label} behind the other screenshots`} onPointerDown={(event) => event.stopPropagation()} onClick={onDismiss} className="pointer-events-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-950"><X size={16} /></button>}
      </div>
    </motion.article>
  );
}

export default function DashboardDemo() {
  const reduceMotion = useReducedMotion();
  const [screenshots, setScreenshots] = useState(platformScreenshots);
  const visibleScreenshots = screenshots.slice(0, 3);

  const rotateStack = () => {
    setScreenshots((current) => current.length > 1 ? [...current.slice(1), current[0]] : current);
  };

  return (
    <section id="platform-demo" className="relative z-0 overflow-hidden bg-[#F8FCFF] px-4 py-20 sm:px-6 sm:py-24">
      <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reduceMotion ? 0 : 0.5 }} className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#00A9B7]">Explore the platform</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">The workflows your teams already need</h2>
      </motion.div>
      <div className="mx-auto mt-10 max-w-4xl">
        <div className="relative h-[390px] sm:h-[590px] lg:h-[660px]">
          {visibleScreenshots.slice().reverse().map((screenshot) => {
            const depth = visibleScreenshots.indexOf(screenshot);
            return <ScreenshotCard key={screenshot.src} screenshot={screenshot} depth={depth} onDismiss={rotateStack} />;
          })}
        </div>
      </div>
    </section>
  );
}
