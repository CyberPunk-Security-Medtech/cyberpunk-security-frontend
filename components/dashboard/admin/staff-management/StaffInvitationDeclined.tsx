export default function StaffInvitationDeclined() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center space-y-4">
        <div className="text-6xl">❌</div>
        <h2 className="text-xl font-semibold">
          Staff Invite Approval Declined!!
        </h2>
        <p className="text-sm text-slate-500 max-w-md">
          Staff invitation declined is currently pending, this might take some
          time, please exercise patience.
        </p>
        <button className="bg-[#051466] text-white px-6 py-2 rounded-full hover:bg-[#020b44]">
          Resend Invitation Link
        </button>
        <button className="border rounded-full px-6 py-2 mt-1 hover:bg-slate-50">
          Back To Dashboard
        </button>
      </div>
    </div>
  );
}
