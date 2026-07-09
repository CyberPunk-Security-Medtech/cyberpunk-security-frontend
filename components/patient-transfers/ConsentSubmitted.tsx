import { CheckCircle2 } from "lucide-react";

export default function ConsentSubmitted() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-16 flex h-80 w-80 items-center justify-center rounded-full bg-[#b6f1ea]">
          <CheckCircle2 className="h-56 w-56 text-[#11bdb2]" />
        </div>

        <h1 className="text-5xl font-bold text-gray-950">
          Consent Submitted Successfully!
        </h1>
      </div>
    </section>
  );
}