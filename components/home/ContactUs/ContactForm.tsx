// import Image from "next/image";


// export default function ContactForm() {
//   return (
//     <form className="p-10 space-y-6 bg-white rounded-r-2xl">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium mb-2">First Name</label>
//           <input
//             type="text"
//             className="w-full border-b border-gray-300 placeholder: First Name text-right focus:outline-none focus:border-[#8D8D8D]"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-2">Last Name</label>
//           <input
//             type="text"
//             className="w-full border-b border-gray-300 focus:outline-none focus:border-[#8D8D8D]"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium mb-2">Email</label>
//           <input
//             type="email"
//             className="w-full border-b border-gray-300 focus:outline-none focus:border-[#8D8D8D]"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-2">Phone Number</label>
//           <input
//             type="tel"
//             className="w-full border-b border-gray-300 focus:outline-none focus:border-[#8D8D8D]"
//           />
//         </div>
//       </div>

//       <div>
//         <p className="text-sm font-medium mb-2">Select Subject?</p>
//         <div className="flex flex-wrap gap-4 text-sm">
//           {["General Inquiry", "About Us", "Our Pricing Plan", "Our Features"].map(
//             (label, i) => (
//               <label key={i} className="flex items-center gap-2">
//                 <input type="radio" name="subject" className="accent-[#011C2A]" />
//                 {label}
//               </label>
//             )
//           )}
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-2">Message</label>
//         <textarea
//           rows={4}
//           placeholder="Write your message..."
//           className="w-full border-b border-gray-300 focus:outline-none focus:border-[#8D8D8D]"
//         ></textarea>
//       </div>
//  <div className="flex flex-col items-end mt-8">
//         <button
//           type="submit"
//           className="bg-[#011C2A] text-white py-3 px-8 rounded-md transition hover:bg-[#022b42]"
//         >
//           Send Message
//         </button>

//         {/* Left arrow image below button */}
//         <Image
//           src="/book-now-polygon.svg"
//           alt="arrow decoration"
//           width={60}
//           height={60}
//           className="mt-4"
//         />
//       </div>
//     </form>
//   );
// }


import { motion } from "framer-motion";
import Image from "next/image";

export default function ContactForm() {
  return (
    <form className="p-10 space-y-6 bg-white rounded-r-2xl">
      {/* First & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-left">
            First Name
          </label>
          <input
            type="text"
            placeholder="Enter your first name"
            className="w-full border-b border-gray-300 text-left placeholder:text-gray-400 focus:outline-none focus:border-[#8D8D8D] py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-left">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Enter your last name"
            className="w-full border-b border-gray-300 text-left placeholder:text-gray-400 focus:outline-none focus:border-[#8D8D8D] py-2"
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-left">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full border-b border-gray-300 text-left placeholder:text-gray-400 focus:outline-none focus:border-[#8D8D8D] py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-left">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            className="w-full border-b border-gray-300 text-left placeholder:text-gray-400 focus:outline-none focus:border-[#8D8D8D] py-2"
          />
        </div>
      </div>

      {/* Subject (Checkbox options) */}
      <div>
        <p className="text-sm font-medium mb-2 text-left">Select Subject</p>
        <div className="flex flex-wrap gap-4 text-sm">
          {[
            "General Inquiry",
            "About Us",
            "Our Pricing Plan",
            "Our Features",
          ].map((label, i) => (
            <label key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="subject"
                className="accent-[#011C2A] w-4 h-4 cursor-pointer"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium mb-2 text-left">
          Message
        </label>
        <textarea
          rows={4}
          placeholder="Write your message..."
          className="w-full border-b border-gray-300 text-left placeholder:text-gray-400 focus:outline-none focus:border-[#8D8D8D] py-2"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col items-end mt-8">
        <button
          type="submit"
          className="bg-[#011C2A] text-white py-3 px-8 rounded-md transition hover:bg-[#022b42]"
        >
          Send Message
        </button>

        {/* Decorative arrow image below button */}
     <motion.div
  animate={{ y: [0, -6, 0] }}
  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  className="relative mt-6 ml-[-30px]" // moves left 30px and down slightly
>
  <Image
    src="/contact-us-polygon.svg"
    alt="arrow decoration"
    width={241}
    height={112}
    className="opacity-90 rotate-[-35deg] scale-95"
    style={{ transformOrigin: "center" }}
  />
</motion.div>

      </div>
    </form>
  );
}
