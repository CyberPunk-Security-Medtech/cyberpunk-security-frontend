// "use client";

// import { motion } from "framer-motion";
// import Image from "next/image";
// import BookingForm from "@components/home/BookNow/BookingForm";
// import CalendarCard from "@components/home/BookNow/CalendarCard";
// import Navbar from "@components/home/Navbar";
// import Footer from "@components/home/FooterSection";

// export default function BookNowPage() {
//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-[#15BDB0]/20 via-[#F8FCFF]/40 to-white overflow-x-hidden">
//       <Navbar />

//       {/* HERO SECTION */}
//           <section className="relative text-center z-10 flex flex-col items-center pt-48 md:pt-56 pb-24 overflow-hidden">
//         {/* Decorative wave */}
//         <motion.div
//           initial={{ y: -40, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 1.2, ease: "easeOut" }}
//           className="absolute right-16 top-24 md:top-28 opacity-80"
//         >
//           <Image src="/vision-wavy-line.svg" alt="waves" width={100} height={50} />
//         </motion.div>

//         {/* Title */}
//         <motion.h1
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, ease: "easeOut" }}
//           className="text-4xl font-bold"
//         >
//           <span className="bg-gradient-to-r from-[#1A2380] to-[#00B8A8] bg-clip-text text-transparent">
//             Book Now
//           </span>
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="text-[#717171] mt-4 max-w-2xl mx-auto"
//         >
//           Schedule your consultation in seconds. Choose a service, pick a time,
//           and confirm — it’s quick, secure, and hassle-free.
//         </motion.p>
//       </section>

//       {/* BOOKING SECTION */}
//       <section className="relative z-0 flex flex-col md:flex-row items-start justify-center gap-10 max-w-6xl mx-auto bg-white shadow-xl px-8 py-12 overflow-visible">
        
//         {/* Dot overlapping Booking Form */}
//         <motion.div
//           initial={{ y: 40, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 1.2, ease: "easeOut" }}
//            className="absolute left-[-5rem] top-[0%] md:top-[-6%] opacity-40 pointer-events-none -z-10"
//         >
//           <Image src="/dot.svg" alt="dots" width={150} height={150} />
//         </motion.div>
        

//         {/* Booking Form */}
//         <motion.div
//           initial={{ opacity: 0, x: -60 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="relative z-10"
//         >
//           <BookingForm />
//         </motion.div>

//         {/* Calendar Card */}
//         <motion.div
//           initial={{ opacity: 0, x: 60 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
//           className="flex-1 w-full relative z-10"
//         >
//           <CalendarCard />
//         </motion.div>

//         {/* Floating Polygon */}
//         <motion.div
//           animate={{ y: [0, -10, 0] }}
//           transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
//           className="pointer-events-none absolute hidden md:block z-20 right-[35%] top-[48%]"
//         >
//           <Image
//             src="/book-now-polygon.svg"
//             alt="paper plane"
//             width={265}
//             height={97}
//             className="opacity-95"
//             style={{ transform: "rotate(10deg)" }}
//           />
//         </motion.div>
//       </section>

//       <Footer />
//     </div>
//   );
// }

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import BookingForm from "@components/home/BookNow/BookingForm";
import CalendarCard from "@components/home/BookNow/CalendarCard";
import Navbar from "@components/home/Navbar";
import Footer from "@components/home/FooterSection";

export default function BookNowPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#15BDB0]/20 via-[#F8FCFF]/40 to-white overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative text-center z-10 flex flex-col items-center pt-48 md:pt-56 pb-24 overflow-hidden">
        {/* Decorative wave (hidden on mobile) */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute right-16 top-24 md:top-28 opacity-80 hidden sm:block"
        >
          <Image src="/vision-wavy-line.svg" alt="waves" width={100} height={50} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl font-bold"
        >
          <span className="bg-gradient-to-r from-[#1A2380] to-[#00B8A8] bg-clip-text text-transparent">
            Book Now
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#717171] mt-4 max-w-2xl mx-auto px-4 sm:px-0"
        >
          Schedule your consultation in seconds. Choose a service, pick a time,
          and confirm — it’s quick, secure, and hassle-free.
        </motion.p>
      </section>

      {/* BOOKING SECTION */}
      <section
        className="
          relative z-[1] flex flex-col md:flex-row md:flex-wrap
          items-start justify-center gap-10 max-w-6xl mx-auto
          bg-white shadow-xl rounded-2xl px-4 sm:px-8 md:px-10 py-12
          overflow-visible
        "
      >
        {/* Dot overlapping Booking Form (hidden on mobile) */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          // ↓ pushes some of it under the white bg of the form
          className="absolute left-[-4rem] md:left-[-5rem] -top-[5%] md:-top-[10%] opacity-70 pointer-events-none z-[-10] hidden sm:block"
        >
          <Image src="/dot.svg" alt="dots" width={180} height={180} className="select-none" />
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-[2] w-full md:w-[48%]"
        >
          <BookingForm />
        </motion.div>

        {/* Calendar Card */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="relative z-[2] w-full md:w-[48%]"
        >
          <CalendarCard />
        </motion.div>

        {/* Floating Polygon (hidden on mobile) */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute hidden sm:block z-[3] right-[47%] top-[48%]"
        >
          <Image
            src="/book-now-polygon.svg"
            alt="paper plane"
            width={265}
            height={97}
            className="opacity-95"
            style={{ transform: 'rotate(10deg)' }}
          />
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
