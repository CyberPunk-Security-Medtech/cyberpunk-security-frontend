// import AnimatedSection from "./Animation";


// export default function Footer() {
//   return (
//     <footer className="bg-gray-900 text-white py-12">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <AnimatedSection>
//             <div>
//               <div className="text-2xl font-bold mb-4">PrivaCure</div>
//               <p className="text-gray-400 mb-4">
//                 Building Africa&apos;s most trusted healthcare data infrastructure.
//               </p>
//               <p className="text-gray-400">
//                 Secure, compliant, and AI-powered interoperability for hospitals, HMOs, and healthcare providers across the continent.
//               </p>
//             </div>
//           </AnimatedSection>

//           <AnimatedSection delay={0.1}>
//             <div>
//               <h3 className="font-semibold mb-4">Product</h3>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="#" className="hover:text-white">Features</a></li>
//                 <li><a href="#" className="hover:text-white">Security</a></li>
//                 <li><a href="#" className="hover:text-white">Integrations</a></li>
//                 <li><a href="#" className="hover:text-white">Pricing</a></li>
//                 <li><a href="#" className="hover:text-white">API Documentation</a></li>
//               </ul>
//             </div>
//           </AnimatedSection>

//           <AnimatedSection delay={0.2}>
//             <div>
//               <h3 className="font-semibold mb-4">Company</h3>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="#" className="hover:text-white">About Us</a></li>
//                 <li><a href="#" className="hover:text-white">Careers</a></li>
//                 <li><a href="#" className="hover:text-white">Press</a></li>
//                 <li><a href="#" className="hover:text-white">Blog</a></li>
//                 <li><a href="#" className="hover:text-white">Contact</a></li>
//               </ul>
//             </div>
//           </AnimatedSection>

//           <AnimatedSection delay={0.3}>
//             <div>
//               <h3 className="font-semibold mb-4">Resources</h3>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="#" className="hover:text-white">Case Studies</a></li>
//                 <li><a href="#" className="hover:text-white">White Papers</a></li>
//                 <li><a href="#" className="hover:text-white">Webinars</a></li>
//                 <li><a href="#" className="hover:text-white">Help Center</a></li>
//                 <li><a href="#" className="hover:text-white">Community</a></li>
//               </ul>
//             </div>
//           </AnimatedSection>
//         </div>

//         <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
//           <AnimatedSection>
//             <p className="text-gray-400 text-sm">
//               © 2024 PrivaCure. All rights reserved.
//             </p>
//           </AnimatedSection>
//           <AnimatedSection delay={0.1}>
//             <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
//               <a href="#" className="hover:text-white">Privacy Policy</a>
//               <a href="#" className="hover:text-white">Terms of Service</a>
//               <a href="#" className="hover:text-white">GDPR</a>
//               <a href="mailto:privacuremedtech@gmail.com" className="hover:text-white">Contact</a>
//             </div>
//           </AnimatedSection>
//         </div>
//       </div>
//     </footer>
//   );
import Image from "next/image";
import { MapPin, Mail, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-visible pt-20 pb-12">
      {/* Background side vectors */}
      
      <Image
        src="/footer-rightside.svg"
        alt=""
        width={320}
        height={320}
        className="pointer-events-none absolute bottom-0 right-0"
      />
  <Image
        src="/footer-leftside.svg"
        alt="footer splash"
        width={280}
        height={280}
       className="absolute left-0 -top-24 md:-top-32 opacity-40 pointer-events-none"
      />
      {/* Glass container */}
      <div
        className="
          relative z-10 mx-auto w-[92%] max-w-6xl
          rounded-[24px] border border-white/30 bg-white/35
          backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.06)]
          px-6 py-10 md:px-10 md:py-12
        "
      >
        {/* Main grid */}
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-10">
          {/* Company info */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Image src="/logo.svg" alt="PrivaCure" width={36} height={36} />
              <span className="text-lg font-semibold text-[#0F1C2E]">PrivaCure</span>
            </div>
            <p className="text-sm leading-6 text-[#2F3E4C]/90">
              Building Africa’s most trusted healthcare data infrastructure.
              Secure, compliant, and AI-powered interoperability for hospitals,
              HMOs, and healthcare providers across the continent.
            </p>

        <div className="mt-4 space-y-2 text-sm text-[#2F3E4C]/90">
  {/* Location */}
  <p className="flex items-center gap-2">
    <MapPin size={20} className="text-[#00A9B7]" />
    <span>Lagos, Nigeria</span>
  </p>

  {/* Email */}
  <a
    href="mailto:privacuremedtech@gmail.com"
    className="flex items-center gap-2 text-black hover:underline"
  >
    <Mail size={20} className="text-[#00A9B7]" />
    <span>Email us</span>
  </a>

  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/company/privacurehealth"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 hover:text-[#0A66C2] transition-colors"
  >
    <Linkedin size={20} className="text-[#0A66C2]" />
    <span>LinkedIn</span>
  </a>
</div>

          </div>

          {/* Link columns on the same line */}
          <FooterCol
            title="Product"
            items={["Features", "Security", "Integrations", "API", "Documentation", "Pricing"]}
          />
          <FooterCol
            title="Company"
            items={["About Us", "Careers", "Press", "Blog", "Contact"]}
          />
          <FooterCol
            title="Resources"
            items={["Case Studies", "White Papers", "Webinars", "Help Center", "Community"]}
          />
          <FooterCol
            title="Legal"
            items={["Privacy Policy", "Terms of Service", "Compliance", "Security", "GDPR"]}
          />
        </div>

        {/* top black divider */}
        <div className="my-6 h-px w-full bg-black/20" />

        {/* Bottom text + email form */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-[#2F3E4C]/80">
            Get the latest updates on PrivaCure’s development and African healthcare innovation.
          </p>

          <form className="relative w-full md:w-[420px]">
            <input
              type="email"
              placeholder="Enter your mail..."
              className="
                w-full rounded-full border border-black/20 bg-white/50
                px-5 py-3 text-sm text-[#0F1C2E]
                placeholder:text-[#0F1C2E]/50
                backdrop-blur-md outline-none
                focus:ring-2 focus:ring-[#00A9B7]
              "
            />
            <button
              type="submit"
              className="
                absolute right-1 top-1/2 -translate-y-1/2
                rounded-full bg-[#00A9B7] px-4 py-2 text-sm font-medium text-white
                hover:bg-[#0096A4] transition
              "
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* bottom black divider */}
        <div className="mt-6 h-px w-full bg-black/20" />

        <p className="mt-6 text-center text-xs text-[#2F3E4C]/70">
          © {new Date().getFullYear()} PrivaCure. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-3 text-[#0F1C2E] font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm text-[#2F3E4C]/90">
        {items.map((x) => (
          <li key={x} className="hover:text-[#00A9B7] transition">
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}