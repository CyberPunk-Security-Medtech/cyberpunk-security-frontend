import { CheckCircle2, Fingerprint } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  buttonText: string;
  helperText: string;
  verified: boolean;
  onVerify: () => void;
};

export default function VerificationCard({
  icon,
  title,
  subtitle,
  buttonText,
  helperText,
  verified,
  onVerify,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-400 bg-white px-8 py-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b6f1ea] text-[#11bdb2]">
          {icon}
        </div>

        <div>
          <h4 className="text-2xl font-bold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>

      <button
        onClick={onVerify}
        className={`flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-medium text-white ${
          verified ? "bg-green-700" : "bg-[#201985]"
        }`}
      >
        {verified ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Verified
          </>
        ) : (
          <>
            <Fingerprint className="h-4 w-4" />
            {buttonText}
          </>
        )}
      </button>

      <p className="mt-3 text-center text-sm text-gray-500">{helperText}</p>
    </div>
  );
}