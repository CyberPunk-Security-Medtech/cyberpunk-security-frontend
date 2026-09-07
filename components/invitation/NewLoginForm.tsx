import { useRouter } from "next/navigation";

type LoginPromptProps = {
  email: string;
  redirectTo: string;
};

function LoginPrompt({ redirectTo }: LoginPromptProps) {
  const router = useRouter();

  return (
    <div className="mt-6">
      <p className="text-sm text-gray-600 mb-4">
        Please log in to accept this invitation.
      </p>
      <button
        type="button"
        onClick={() => router.push(redirectTo)}
        className="min-h-11 w-full rounded-full bg-[#1E237E] py-2 text-white transition-colors hover:bg-[#171B65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E237E] focus-visible:ring-offset-2 motion-reduce:transition-none"
      >
        Login
      </button>
    </div>
  );
}

export default LoginPrompt;
