// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { CheckCircle, AlertTriangle } from "lucide-react";
// import { invitationService } from "@services/api";

// type InviteData = {
//   organization_name: string;
//   role: string;
//   email: string;
// };

// export default function AcceptInvitationPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");

//   const [invite, setInvite] = useState<InviteData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [accepted, setAccepted] = useState(false);

//   useEffect(() => {
//     if (!token) {
//       setError("Invalid or missing invitation token.");
//       setLoading(false);
//       return;
//     }

//     const fetchInvite = async () => {
//       try {
//         const res = await invitationService.getInviteDetails(token);
//         setInvite(res);
//       } catch (err) {
//         setError("This invitation is invalid or has expired.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInvite();
//   }, [token]);

//   const handleAccept = async () => {
//     if (!token) return;

//     try {
//       await invitationService.acceptInvite(token);
//       setAccepted(true);

//       // refresh workspaces after login
//       localStorage.removeItem("workspaces");

//       setTimeout(() => {
//         router.push("/auth/login");
//       }, 2000);
//     } catch (err) {
//       setError("Failed to accept invitation.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-500">Loading invitation…</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-center px-6">
//         <div className="max-w-md">
//           <AlertTriangle className="mx-auto text-red-500 mb-3" size={36} />
//           <h2 className="text-lg font-semibold text-gray-800">Invitation Error</h2>
//           <p className="text-sm text-gray-600 mt-2">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (accepted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-center px-6">
//         <div className="max-w-md">
//           <CheckCircle className="mx-auto text-green-600 mb-3" size={40} />
//           <h2 className="text-xl font-semibold text-gray-900">
//             Invitation Accepted
//           </h2>
//           <p className="text-sm text-gray-600 mt-2">
//             Redirecting you to login…
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
//         <h2 className="text-xl font-bold text-gray-900">
//           You’ve been invited
//         </h2>

//         <p className="text-gray-600 text-sm mt-2">
//           <span className="font-medium">{invite?.email}</span> has been invited
//           to join
//         </p>

//         <p className="text-lg font-semibold mt-2">
//           {invite?.organization_name}
//         </p>

//         <span className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
//           Role: {invite?.role}
//         </span>

//         <button
//           onClick={handleAccept}
//           className="w-full mt-6 bg-blue-900 text-white py-2 rounded-full hover:bg-blue-800 transition"
//         >
//           Accept Invitation
//         </button>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { CheckCircle, AlertTriangle } from "lucide-react";
// import { invitationService } from "@services/api";

// type InviteData = {
//   organization_name: string;
//   role: string;
//   email: string;
// };

// export default function AcceptInvitationPage() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();

//   const [invite, setInvite] = useState<InviteData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [accepted, setAccepted] = useState(false);

//   useEffect(() => {
//     if (!id) {
//       setError("Invalid invitation link.");
//       setLoading(false);
//       return;
//     }

//     const loadInvite = async () => {
//       try {
//         const data = await invitationService.getInviteDetails(id);
//         setInvite(data);
//       } catch {
//         setError("This invitation is invalid or has expired.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadInvite();
//   }, [id]);

//   const handleAccept = async () => {
//     try {
//       await invitationService.acceptInvite(id);

//       // clear stale data
//       localStorage.removeItem("workspaces");

//       setAccepted(true);
//       setTimeout(() => router.push("/auth/login"), 2000);
//     } catch {
//       setError("Failed to accept invitation.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         Loading invitation…
//       </div>
//     );
//   }

//   if (error) {
//     return (
//      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
//   <AlertTriangle className="text-red-500 mb-3" size={36} />
//   <p className="text-gray-600">{error}</p>
// </div>
//     );
//   }

//   if (accepted) {
//     return (
//     <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
//         <CheckCircle className="mx-auto text-green-600 mb-3" size={40} />
//         <p className="text-gray-700">Invitation accepted. Redirecting…</p>
//       </div>
//     );
//   }
//   console.log(invite)

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
//         <h2 className="text-xl font-bold">You’ve been invited</h2>

//         <p className="text-sm text-gray-600 mt-2">
//           {invite?.email} has been invited to join
//         </p>

//         <p className="text-lg font-semibold mt-1">
//           {invite?.organization_name}
//         </p>

//         <span className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
//           Role: {invite?.role}
//         </span>

//         <button
//           onClick={handleAccept}
//           className="w-full mt-6 bg-blue-900 text-white py-2 rounded-full"
//         >
//           Accept Invitation
//         </button>
//       </div>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { CheckCircle, AlertTriangle } from "lucide-react";
// import { invitationService } from "@services/api";
// import { useAuth } from "@context/AuthContext";
// import SetPasswordForm from "@components/invitation/NewPasswordForm";
// import LoginPrompt from "@components/invitation/NewLoginForm";

// type InviteData = {
//   email: string;
//   role: string;
//   user_exists: boolean;
//   organization: {
//     id: string;
//     name: string;
//     slug: string;
//     image_url: string | null;
//   };
// };

// type Step = "loading" | "error" | "set-password" | "login" | "accept" | "success";

// export default function AcceptInvitationPage() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();
//   const { user, refreshWorkspaces } = useAuth();

//   const [invite, setInvite] = useState<InviteData | null>(null);
//   const [step, setStep] = useState<Step>("loading");
//   const [error, setError] = useState("");
//   useEffect(() => {
//     if (!id) {
//       setError("Invalid invitation link.");
//       setStep("error");
//       return;
//     }
//  // setInvite(inviteData);
//     // const loadInvite = async () => {
//     //   try {
//     //     const inviteData = await 
//         invitationService.getInviteDetails(id)
//         .then(setInvite)
//         .catch(() => {
//           setError("This invitation is invalid or has expired.");
//           setStep("error");
//         });
//       }, [id]);
//     //)
       
// useEffect(() => {
//     if (!invite) return;

    
//         if (!invite.user_exists) {
//           setStep("set-password");
//           return;
//         } 
        
//         if (!user || user.email !== invite.email) {
//           setStep("login");
//           return;
//         } 

//           setStep("accept");
//       }, [invite, user]);
     

//   const acceptInvite = async () => {
//     try {
//       await invitationService.acceptInvite(id);
//       await refreshWorkspaces();
//       setStep("success");
//       setTimeout(() => router.push("/auth/workspace-select"), 1500);
//     } catch {
//       setError("Failed to accept invitation.");
//       setStep("error");
//     }
//   };

//   if (step === "loading") {
//     return <Centered>Loading invitation…</Centered>;
//   }

//   if (step === "error") {
//     return (
//       <Centered>
//         <AlertTriangle className="text-red-500 mb-3" size={36} />
//         <p>{error}</p>
//       </Centered>
//     );
//   }

//   return (
//     <Centered>
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
//         <h2 className="text-xl font-bold">You’ve been invited {" "} {invite?.email}</h2>

//         {/* <p className="text-sm text-gray-600 mt-2">{invite?.email}</p> */}
//         <p className="text-lg font-semibold">{invite?.organization?.name}</p>

//         <span className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
//           Role: {invite?.role}
//         </span>

//         {step === "set-password" &&  <SetPasswordForm
//             email={invite!.email}
//             invitationId={id}
//              onSuccess={() => setStep("accept")}
//   />}
//         {step === "login" && <LoginPrompt email={invite!.email} />}

//         {step === "accept" && (
//           <button
//             onClick={acceptInvite}
//             className="w-full mt-6 bg-blue-900 text-white py-2 rounded-full"
//           >
//             Accept Invitation
//           </button>
//         )}

//         {step === "success" && (
//           <>
//             <CheckCircle className="mx-auto text-green-600 mb-3" size={40} />
//             <p>Invitation accepted!</p>
//           </>
//         )}
//       </div>
//     </Centered>
//   );
// }

// const Centered = ({ children }: { children: React.ReactNode }) => (
//   <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//     {children}
//   </div>
// );


"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { invitationService } from "@services/api";
import { useAuth } from "@context/AuthContext";
import SetPasswordForm from "@components/invitation/NewPasswordForm";
import LoginPrompt from "@components/invitation/NewLoginForm";

type InviteData = {
  email: string;
  role: string;
  user_exists: boolean;
  organization: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
  };
};

type Step =
  | "loading"
  | "error"
  | "set-password"
  | "login"
  | "accept"
  | "success";

export default function AcceptInvitationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // IMPORTANT: Auth context MUST expose loading state
  const { user, hydrated, authLoading, refreshWorkspaces } = useAuth();

  const [invite, setInvite] = useState<InviteData | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  /* -----------------------------
     Load invitation details
  ------------------------------ */
  useEffect(() => {
    if (!id) {
      setError("Invalid invitation link.");
      setStatus("error");
      return;
    }

    invitationService
      .getInviteDetails(id)
      .then(setInvite)
      .catch(() => {
        setError("This invitation is invalid or has expired.");
        setStatus("error");
      });
  }, [id]);

  /* -----------------------------
     DERIVED STEP (KEY FIX)
  ------------------------------ */
  const step: Step = useMemo(() => {
    if (status === "error") return "error";
    if (status === "success") return "success";

    if (!invite) return "loading";

    if (!invite.user_exists) return "set-password";

    if (!hydrated || authLoading) return "loading";

    if (!user) return "login";

    if (user.email !== invite.email) return "login";

    return "accept";
  }, [invite, user, hydrated,authLoading, status]);

  /* -----------------------------
     Accept invitation
  ------------------------------ */
  const acceptInvite = async () => {
    try {
      await invitationService.acceptInvite(id);
      await refreshWorkspaces();
      setStatus("success");
      setTimeout(() => router.push("/auth/workspace-select"), 1500);
    } catch {
      setError("Failed to accept invitation.");
      setStatus("error");
    }
  };

  /* -----------------------------
     UI STATES
  ------------------------------ */
  if (step === "loading") {
    return <Centered>Loading invitation…</Centered>;
  }

  if (step === "error") {
    return (
      <Centered>
        <AlertTriangle className="text-red-500 mb-3" size={36} />
        <p>{error}</p>
      </Centered>
    );
  }

  if (step === "success") {
    return (
      <Centered>
        <CheckCircle className="mx-auto text-green-600 mb-3" size={40} />
        <p>Invitation accepted!</p>
      </Centered>
    );
  }

  /* -----------------------------
     MAIN CONTENT
  ------------------------------ */
  return (
    <Centered>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
        <h2 className="text-xl font-bold">
          You’ve been invited {invite?.email}
        </h2>

        <p className="text-lg font-semibold mt-1">
          {invite?.organization?.name}
        </p>

        <span className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
          Role: {invite?.role}
        </span>

        {step === "set-password" && (
          <SetPasswordForm
            email={invite!.email}
            invitationId={id}
            onSuccess={() => setStatus("idle")}
          />
        )}

        {step === "login" && <LoginPrompt 
        email={invite!.email}
         onSuccess ={() => {setStatus("idle")}}
         redirectTo={`/auth/login?email=${encodeURIComponent(invite!.email)}&redirect=/invitations/${id}/view`}
        />}

        {step === "accept" && (
          <button
            onClick={acceptInvite}
            className="w-full mt-6 bg-blue-900 text-white py-2 rounded-full"
          >
            Accept Invitation
          </button>
        )}
      </div>
    </Centered>
  );
}

/* -----------------------------
   Layout helper
------------------------------ */
const Centered = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    {children}
  </div>
);