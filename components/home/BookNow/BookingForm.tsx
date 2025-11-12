// "use client";

// import Button from "@components/Button";
// import { motion } from "framer-motion";


// export default function BookingForm() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       className="flex flex-col items-start justify-center gap-6"
//     >
//       {/* Header with partial gradient */}
//       <h2 className="text-2xl md:text-3xl font-semibold text-black mb-2">
//         Book Your First{" "}
//         <span className="bg-gradient-to-r from-[#1A2380] to-[#00B8A8] bg-clip-text text-transparent">
//         Appointment Session
//         </span>
//       </h2>

//       {/* Input fields */}
//       <div className="flex flex-col md:flex-row gap-4">
//         <input
//           type="text"
//           placeholder="First name"
//           className="w-[308px] h-[48px] rounded-md border border-white/50 bg-white/20 backdrop-blur-md text-[#1A2380] placeholder:text-[#1A2380]/60 px-4 outline-none shadow-[0_4px_20px_rgba(255,255,255,0.4),0_2px_10px_rgba(0,0,0,0.15)] focus:ring-2 focus:ring-[#00B8A8] transition"
//         />
//         <input
//           type="text"
//           placeholder="Last name"
//           className="w-[308px] h-[48px] rounded-md border border-white/50 bg-white/20 backdrop-blur-md text-[#1A2380] placeholder:text-[#1A2380]/60 px-4 outline-none shadow-[0_4px_20px_rgba(255,255,255,0.4),0_2px_10px_rgba(0,0,0,0.15)] focus:ring-2 focus:ring-[#00B8A8] transition"
//         />
//       </div>

//       <div className="flex flex-col md:flex-row gap-4">
//         <input
//           type="email"
//           placeholder="Email address"
//           className="w-[308px] h-[48px] rounded-md border border-white/50 bg-white/20 backdrop-blur-md text-[#1A2380] placeholder:text-[#1A2380]/60 px-4 outline-none shadow-[0_4px_20px_rgba(255,255,255,0.4),0_2px_10px_rgba(0,0,0,0.15)] focus:ring-2 focus:ring-[#00B8A8] transition"
//         />
//         <input
//           type="tel"
//           placeholder="Phone number"
//           className="w-[308px] h-[48px] rounded-md border border-white/50 bg-white/20 backdrop-blur-md text-[#1A2380] placeholder:text-[#1A2380]/60 px-4 outline-none shadow-[0_4px_20px_rgba(255,255,255,0.4),0_2px_10px_rgba(0,0,0,0.15)] focus:ring-2 focus:ring-[#00B8A8] transition"
//         />
//       </div>

//       {/* Textarea */}
//       <textarea
//         placeholder="Write your message..."
//         className="w-[640px] h-[216px] rounded-md border border-white/50 bg-white/20 backdrop-blur-md text-[#1A2380] placeholder:text-[#1A2380]/60 p-4 outline-none shadow-[0_6px_25px_rgba(255,255,255,0.4),0_3px_15px_rgba(0,0,0,0.25)] focus:ring-2 focus:ring-[#00B8A8] transition resize-none"
//       />
//       <Button type="submit" className="bg-black text-white rounded-[5px] w-[126px] h-[52px]">Book Now</Button>
//     </motion.div>
//   );
// }

"use client";

import Button from "@components/Button";
import { motion } from "framer-motion";

export default function BookingForm() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-start justify-center gap-6 w-full"
    >
      {/* Header */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-2">
        Book Your First{" "}
        <span className="bg-gradient-to-r from-[#1A2380] to-[#00B8A8] bg-clip-text text-transparent">
          Appointment Session
        </span>
      </h2>

      {/* Input fields */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <input
          type="text"
          placeholder="First name"
          className="flex-1 min-w-0 h-[48px] rounded-md border border-white/50 bg-white/20 backdrop-blur-md text-[#1A2380] placeholder:text-[#1A2380]/60 px-4 outline-none shadow-[0_4px_20px_rgba(255,255,255,0.4),0_2px_10px_rgba(0,0,0,0.15)] focus:ring-2 focus:ring-[#00B8A8] transition"
        />
        <input
          type="text"
          placeholder="Last name"
          className="flex-1 min-w-0 h-[48px] rounded-md border border-white/50 bg-white/20 backdrop-blur-md text-[#1A2380] placeholder:text-[#1A2380]/60 px-4 outline-none shadow-[0_4px_20px_rgba(255,255,255,0.4),0_2px_10px_rgba(0,0,0,0.15)]  focus:ring-2 focus:ring-[#00B8A8] transition"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        <input
          type="email"
          placeholder="Email address"
          className="flex-1 min-w-0 h-[48px] rounded-md border border-white/50 bg-white/20 backdrop-blur-md text-[#1A2380] placeholder:text-[#1A2380]/60 px-4 outline-none shadow-[0_4px_20px_rgba(255,255,255,0.4),0_2px_10px_rgba(0,0,0,0.15)] focus:ring-2 focus:ring-[#00B8A8] transition"
        />
        <input
          type="tel"
          placeholder="Phone number"
          className="flex-1 min-w-0 h-[48px] rounded-md border border-white/50 bg-white/20 backdrop-blur-md text-[#1A2380] placeholder:text-[#1A2380]/60 px-4 outline-none shadow-[0_4px_20px_rgba(255,255,255,0.4),0_2px_10px_rgba(0,0,0,0.15)] focus:ring-2 focus:ring-[#00B8A8] transition"
        />
      </div>

      {/* Textarea */}
      <textarea
        placeholder="Write your message..."
        className="w-full min-h-[180px] sm:min-h-[200px] md:min-h-[216px] rounded-md border border-white/50 bg-white/20 backdrop-blur-md text-[#1A2380] placeholder:text-[#1A2380]/60 p-4 outline-none shadow-[0_6px_25px_rgba(255,255,255,0.4),0_3px_15px_rgba(0,0,0,0.25)] focus:ring-2 focus:ring-[#00B8A8] transition resize-none"
      />

      <Button
        type="submit"
        className="bg-black text-white rounded-[5px] w-[126px] h-[52px] text-sm md:text-base"
      >
        Book Now
      </Button>
    </motion.div>
  );
}
