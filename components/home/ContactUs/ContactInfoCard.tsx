import Image from "next/image";

export default function ContactInfoCard() {
  return (
     <div className="flex h-full w-full flex-col justify-between p-6 text-white sm:p-10">
      <div>
        <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
        <p className="mb-8 text-sm opacity-90">Reach our team through the channels below.</p>

        <ul className="space-y-5">
          <li className="flex items-center gap-3">
            <Image src="/icons/phone.svg" alt="phone" width={24} height={24} />
            <span>+234 906 142 8924</span>
          </li>
          <li className="flex items-center gap-3">
            <Image src="/icons/mail.svg" alt="email" width={24} height={24} />
            <span>privacuremedtech@gmail.com</span>
          </li>
          <li className="flex items-center gap-3">
            <Image src="/icons/location.svg" alt="location" width={24} height={24} />
            <span>Supporting healthcare teams globally</span>
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-5 mt-10">
        <a href="#" className="p-2 bg-white/20 rounded-full">
          <Image src="/icons/twitter.svg" alt="twitter" width={30} height={30} />
        </a>
        <a href="#" className="p-2 bg-white/20 rounded-full">
          <Image src="/icons/instagram.svg" alt="instagram" width={30} height={30} />
        </a>
        <a href="#" className="p-2 bg-white/20 rounded-full">
          <Image src="/icons/discord.svg" alt="discord" width={30} height={30} />
        </a>
      </div>
    </div>
  );
}
