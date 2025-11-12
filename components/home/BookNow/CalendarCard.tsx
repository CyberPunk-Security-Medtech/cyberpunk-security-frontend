"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";

type Day = {
  date: Date;
  inMonth: boolean;
};

function monthMatrix(year: number, month: number): Day[] {
  // month is 0-based
  const first = new Date(year, month, 1);
  const start = new Date(first);
  const weekday = (first.getDay() + 6) % 7; // make Monday=0
  start.setDate(first.getDate() - weekday);

  const days: Day[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({ date: d, inMonth: d.getMonth() === month });
  }
  return days;
}

const dow = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function CalendarCard() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<Date | null>(null);

  const days = useMemo(() => monthMatrix(viewYear, viewMonth), [viewYear, viewMonth]);

  function nextMonth() {
    const m = viewMonth + 1;
    if (m > 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth(m);
  }
  function prevMonth() {
    const m = viewMonth - 1;
    if (m < 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth(m);
  }

  const title = `${months[viewMonth]} ${viewYear}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full rounded-[10px] p-6 md:p-8 text-white
                 bg-gradient-to-br from-[#0b6fc5] to-[#00b7aa] shadow-lg"
    >
      {/* Heading */}
      <div className="text-center mb-6">
        <p className="text-sm/6 uppercase tracking-wide opacity-85">Choose a day</p>

        <div className="mt-2 flex items-center justify-center gap-3">
          <button
            aria-label="Prev month"
            onClick={prevMonth}
            className="grid size-8 place-items-center rounded-full/50 bg-white/10 hover:bg-white/15"
          >
            <Image src="/left-arrow-calendar.svg" alt="prev" width={3} height={0} />
          </button>

          <span className="min-w-[180px] text-center font-semibold">
            {title}
          </span>

          <button
            aria-label="Next month"
            onClick={nextMonth}
            className="grid size-8 place-items-center rounded-full/50 bg-white/10 hover:bg-white/15"
          >
            <Image src="/right-arrow-calendar.svg" alt="next" width={3} height={0} />
          </button>
        </div>

        {/* DOW */}
        <div className="mt-6 grid grid-cols-7 text-xs/5 uppercase tracking-wide opacity-85">
          {dow.map((d) => (
            <div key={d} className="text-center">{d}</div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-y-3">
        {days.map(({ date, inMonth }, i) => {
          const isToday =
            date.toDateString() === new Date().toDateString() && inMonth;
          const isSelected =
            selected?.toDateString() === date.toDateString();

          return (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={i}
              onClick={() => inMonth && setSelected(date)}
              disabled={!inMonth}
              className={clsx(
                "mx-auto grid size-9 place-items-center rounded-full text-sm font-medium",
                !inMonth && "opacity-40 cursor-not-allowed",
                inMonth && !isSelected && !isToday && "hover:bg-white/10",
                isToday && !isSelected && "ring-2 ring-white/60",
                isSelected && "bg-white text-[#0b6fc5]"
              )}
              aria-pressed={isSelected}
            >
              {date.getDate()}
            </motion.button>
          );
        })}
      </div>

      {/* Availability pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mt-6 flex justify-center"
      >
        <button className="rounded-full bg-white text-[#0b6fc5] px-5 py-2 text-sm font-semibold shadow-md">
          One slot available in {months[viewMonth].toLowerCase()}
        </button>
      </motion.div>

      {/* Divider */}
      <div className="my-6 h-px w-full bg-white/20" />

      {/* Timezone row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/icons/globe.svg" alt="globe" width={16} height={16} />
          <span className="text-sm/6 opacity-90">WAT (UTC+1)</span>
        </div>

        <div className="flex items-center gap-2">
          <Image src="/icons/clock.svg" alt="clock" width={16} height={16} />
          <span className="text-sm/6 opacity-90">
            {selected ? selected.toDateString() : "No date selected"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
