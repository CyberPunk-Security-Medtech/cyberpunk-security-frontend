// "use client";

// import { motion } from "framer-motion";
// import Image from "next/image";

// const team = [
//   { name: "Abimbola Godwin", role: "CEO & Founder", img: "/Godwin_img.jpg" },
//   { name: "Dr Somtochuku Ekwegbara", role: "Medical Advisor", img: "/dr_somto_img.jpg" },
//   { name: "Oyawoye Anuoluwapo", role: "Director", img: "/anuoluwapo_img.jpg" },
//   { name: "Ogechi Esther", role: "Compliance/GRC Specialist", img: "/ogech_img.png" },
//   { name: "David Kim", role: "Financial Advisor", img: "/financial_advisor_img.jpg" },
// ];

// export default function TeamSection() {
//   return (
//     <motion.section
//       className="relative py-24 text-center font-sans"
//       initial={{ opacity: 0, y: 50 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 1 }}
//     >  
//       {/* Wavy Line Background */}
//       <Image
//         src="/how-our-platform-works-wavy-line.svg"
//         alt="decorative curve"
//         className="hidden md:block absolute left-0 w-full opacity-70"

//         style={{
//           top: "32%",
//           transform: "translateY(-15%)",
//           zIndex: 0,
//         }}
//         width={1200}
//         height={200}
//       />

//       {/* Section Heading */}
//       <h3 className="text-4xl md:text-5xl font-bold mb-6">
//         Meet{" "}
//         <span className="bg-gradient-to-l from-[#00B8A8] to-[#1A2380] bg-clip-text text-transparent">
//           Our Team
//         </span>
//       </h3>
//       <p className="text-gray-500 mt-3 mb-14">
//         The passionate individuals behind our success
//       </p>

//       {/* Team Grid */}
//     <div className="flex flex-wrap justify-center gap-8 sm:gap-10 px-4 sm:px-6 md:px-12">
//         {team.map((member, i) => (
//           <div key={i} className="relative w-64 flex flex-col items-center text-center">
//             {/* Decorative Vector only for the fifth card */}
//             {i === 4 && (
//               <motion.img
//                 src="/circular-vector.svg"
//                 alt="decorative vector"
//                 className="hidden md:block absolute left-[-27rem] top-1/2 -translate-y-1/2 w-32 h-28 z-0"

//                 initial={{ opacity: 0, x: -40 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 1 }}
//               />
//             )}

//             {/* Card Content */}
//             <div className="bg-white shadow-md rounded-3xl p-6 flex flex-col items-center text-center
//                             transition-transform duration-300 hover:scale-105 relative z-10 min-h-[400px]">
//               {/* Circular Image */}
//               <div className="relative w-36 h-36 mb-4 rounded-full overflow-hidden flex-shrink-0">
//                 <Image src={member.img} alt={member.name} fill className="object-cover" sizes="144px" />
//               </div>

//               {/* Name & Role */}
//               <div className="flex flex-col justify-between h-[120px]">
//                 <h4 className="font-semibold text-[#1A2380] text-lg">{member.name}</h4>
//                 <p className="text-sm text-gray-600 leading-snug">{member.role}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </motion.section>
//   );
// }


"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const team = [
  { name: "Godwin Abimbola", role: "CEO / Founder", img: "/godwin-pic.png" },
  { name: "Israel Adedokun", role: "Capital Strategy and Growth", img: "/financial_advisor_img.jpg" },
  { name: "Dr. Chukwuebuka Collins", role: "Head of strategy & Global Partnerships", img: "/collins-pic.png" },
  { name: "Dr. S. Ekwegbara", role: "Clinical Operations & Health strategy", img: "/dr_somto_img.jpg" },
  { name: "Prevailer Ndubueze", role: "Security & Infrastructure lead", img: "/prevailer-pic.png" },
  { name: "Stephen David", role: "Product Lead", img: "/stephen-pic.png" },
  { name: "Oluchi Faith", role: "Governance, Risk & Compliance (GRC) Lead", img: "/oluchi-pic.png" },
  { name: "Nonso Henry", role: "Head of Legal & Regulatory Affairs", img: "/nonso-pic.png" },
];

export default function TeamSection() {
  return (
    <motion.section
      className="relative py-24 text-center font-sans overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Wavy Line Background (hidden on mobile) */}
      <Image
        src="/how-our-platform-works-wavy-line.svg"
        alt="decorative curve"
        className="hidden md:block absolute left-0 w-full opacity-70"
        style={{
          top: "32%",
          transform: "translateY(-15%)",
          zIndex: 0,
        }}
        width={1200}
        height={200}
      />

      {/* Decorative Vector */}
      <motion.img
        src="/circular-vector.svg"
        alt="decorative vector"
        className="hidden md:block absolute left-[-15rem] bottom-10 w-64 h-64 z-0 opacity-20"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      />

      {/* Section Heading */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        <h3 className="text-4xl md:text-4xl font-bold mb-4">
          Meet{" "}
          <span className="bg-gradient-to-l from-[#00B8A8] to-[#1A2380] bg-clip-text text-transparent">
            Our Team
          </span>
        </h3>
        <p className="text-gray-500 mt-2 mb-16 max-w-2xl mx-auto">
          The passionate individuals behind our success
        </p>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
          {team.map((member, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center w-full"
            >
              {/* Card */}
              <div className="bg-white shadow-[0_4px_25px_rgba(0,0,0,0.06)] rounded-2xl p-6 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 relative z-10 w-full h-[280px]">
                {/* Circular Image with gradient ring and white gap */}
                <div className="relative w-[110px] h-[110px] mb-5 rounded-full bg-gradient-to-br from-[#1A2380] to-[#00B8A8] p-[3px] flex-shrink-0">
                  <div className="w-full h-full rounded-full border-[3px] border-white overflow-hidden relative">
                    <Image
                      src={member.img}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 110px, 110px"
                    />
                  </div>
                </div>

                {/* Name & Role */}
                <div className="flex flex-col flex-grow items-center justify-start w-full">
                  <h4 className="font-semibold text-[#1A2380] text-[17px] leading-tight mb-2">
                    {member.name}
                  </h4>
                  <p className="text-[13px] text-gray-500 leading-snug">
                    {member.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
