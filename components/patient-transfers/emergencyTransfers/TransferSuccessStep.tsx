"use client";

export default function TransferSuccessStep({
  onGoToDashboard,
  onSeeAppointmentDetails,
}: {
  onGoToDashboard: () => void;
  onSeeAppointmentDetails?: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[620px] max-w-2xl flex-col items-center justify-center text-center">
      <div className="mb-8 text-8xl">🎉</div>

      <h1 className="text-4xl font-bold leading-tight text-[#111827]">
        Patient Transfer Details
        <br />
        Successfully!
      </h1>

      <p className="mt-6 max-w-lg text-gray-400">
        Patient transfer is still pending as recipient hospital are yet to confirm the request.
        This might take up to 24hours
      </p>

      <div className="mt-8 w-full max-w-xl space-y-3">
        <button
          onClick={onGoToDashboard}
          className="w-full rounded-full bg-[#211783] px-8 py-4 text-white hover:bg-[#18105f]"
        >
          Go to Dashboard
        </button>

        <button
          onClick={onSeeAppointmentDetails}
          className="w-full rounded-full border border-[#00B8A8] px-8 py-4 text-[#00B8A8] hover:bg-[#F0FFFF]"
        >
          See Appointment Details
        </button>
      </div>
    </div>
  );
}