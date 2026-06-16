import { Suspense } from "react";
import ConsentConfirmClient from "./ConsentConfirmClient";

export default function ShareConsentConfirmPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f7fbfb] px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">Checking consent link...</p>
          </div>
        </main>
      }
    >
      <ConsentConfirmClient />
    </Suspense>
  );
}
