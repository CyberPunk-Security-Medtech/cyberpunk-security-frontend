import { Info } from "lucide-react";

type Props = {
  consent: "yes" | "no" | "";
  setConsent: (value: "yes" | "no" | "") => void;
  allVerified: boolean;
};

export default function ConsentDeclaration({
  consent,
  setConsent,
  allVerified,
}: Props) {
  return (
    <>
      <div className="mt-8 rounded-xl border border-gray-300 bg-white p-8">
        <h3 className="mb-6 text-xl font-bold text-gray-900">
          Consent Declaration
        </h3>

        <div className="text-[15px] leading-7 text-gray-500">
          <p>By signing below or completing a facial scan, I confirm that:</p>

          <ol className="list-decimal pl-5">
            <li>
              I have been informed about how my medical records and biometric
              data will be collected, used, and shared.
            </li>
            <li>
              I understand that my facial scan serves as my consent for the
              sharing of my medical records within the network.
            </li>
            <li>
              I understand that in emergency situations:
              <ul className="list-disc pl-6">
                <li>I shall receive an SMS notification</li>
                <li>
                  Where I cannot respond due to critical medical conditions, my
                  next of kin shall be contacted.
                </li>
                <li>
                  If no response is received within 1 hour, my previously given
                  consent shall be relied upon to support my medical care.
                </li>
              </ul>
            </li>
            <li>
              I understand that only necessary medical information will be
              shared in such cases.
            </li>
            <li>
              I understand that trusted third parties may be involved in securely
              processing my data.
            </li>
            <li>I understand that I can withdraw my consent at any time.</li>
            <li>
              I understand that refusing consent may delay care during emergencies
              or transfers.
            </li>
          </ol>
        </div>

        <div className="mt-8 space-y-3">
          <label className="flex items-center gap-3 text-sm font-bold text-gray-800">
            <input
              type="radio"
              name="consent"
              checked={consent === "yes"}
              onChange={() => setConsent("yes")}
              className="h-5 w-5 accent-[#11bdb2]"
            />
            YES, I consent to biometric identification and medical data sharing.
          </label>

          <label className="flex items-center gap-3 text-sm font-bold text-gray-800">
            <input
              type="radio"
              name="consent"
              checked={consent === "no"}
              onChange={() => setConsent("no")}
              className="h-5 w-5 accent-[#11bdb2]"
            />
            NO, I do not consent.
          </label>
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <FormSection title="Patient Details:" fields={["Patient Name:", "Date:"]} />

          <FormSection
            title="Hospital Use Only:"
            fields={[
              "Hospital Representative:",
              "Staff ID Number:",
              "Facility Name:",
              "Date:",
            ]}
          />
        </div>
      </div>

      {!allVerified && (
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-8 py-6 text-gray-500">
          <Info className="h-5 w-5" />
          <p className="text-sm">
            Please complete all verification methods before providing consent.
          </p>
        </div>
      )}
    </>
  );
}

function FormSection({
  title,
  fields,
}: {
  title: string;
  fields: string[];
}) {
  return (
    <div>
      <h4 className="mb-4 font-bold text-gray-800">{title}</h4>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field} className="flex items-center gap-2">
            <span className="whitespace-nowrap font-semibold text-gray-800">
              {field}
            </span>

            <input
              placeholder={field === "Date:" ? "DD/MM/YY" : ""}
              className="h-8 w-full max-w-[260px] rounded-md bg-gray-200 px-3 text-sm outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}