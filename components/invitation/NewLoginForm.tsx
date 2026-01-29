import { useRouter } from "next/navigation";

type LoginPromptProps = {
  email: string;
  onSuccess: () => void;
  redirectTo: string ;
};



function LoginPrompt({ email, redirectTo }: LoginPromptProps) {
  const router = useRouter();
  return (
    <div className="mt-6">
      <p className="text-sm text-gray-600 mb-4">
        Please log in to accept this invitation.
      </p>
      <button onClick={() =>router.push
        (redirectTo)}
        className="block bg-blue-900 text-white py-2 rounded-full"
      >
        Login
      </button>
    </div>
  );
}

export default LoginPrompt;