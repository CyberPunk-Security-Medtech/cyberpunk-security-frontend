import { SignupProvider } from "@context/SignUpContext";

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <SignupProvider>
      {/* <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4"> */}
        {/* <div className="bg-white shadow-md rounded-2xl w-full max-w-lg p-8"> */}
          {children}
        {/* </div> */}
      {/* </main> */}
    </SignupProvider>
  );
}
