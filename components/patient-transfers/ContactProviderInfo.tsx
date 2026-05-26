import { User } from "lucide-react";

type Props = {
  patientName: string;
  setPatientName: (value: string) => void;
  isGuardian: boolean;
  setIsGuardian: (value: boolean) => void;
};

export default function ContactProviderInfo({
  patientName,
  setPatientName,
  isGuardian,
  setIsGuardian,
}: Props) {
  return (
    <section className="mb-8 rounded-xl bg-white px-8 py-9 shadow-sm">
      <div className="flex items-center gap-4">
        <User className="h-6 w-6 text-gray-900" />
        <h3 className="text-2xl font-bold text-gray-900">
          Contact Provider Information
        </h3>
      </div>

      <div className="mt-8">
        <label className="mb-3 block font-semibold text-gray-900">
          Patient Full Name
        </label>

        <input
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Enter patient’s full name"
          className="h-11 w-full rounded-md bg-[#f0fffd] px-4 text-sm outline-none focus:ring-2 focus:ring-[#11bdb2]"
        />

        <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
          <input
            type="checkbox"
            checked={isGuardian}
            onChange={(e) => setIsGuardian(e.target.checked)}
            className="h-5 w-5 accent-[#11bdb2]"
          />
          I am a legal guardian providing consent on behalf of the patient
        </label>
      </div>
    </section>
  );
}