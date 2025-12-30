function LoginPrompt({ email }: { email: string }) {
  return (
    <div className="mt-6">
      <p className="text-sm text-gray-600 mb-4">
        Please log in to accept this invitation.
      </p>
      <a
        href={`/auth/login?email=${encodeURIComponent(email)}`}
        className="block bg-blue-900 text-white py-2 rounded-full"
      >
        Login
      </a>
    </div>
  );
}

export default LoginPrompt;