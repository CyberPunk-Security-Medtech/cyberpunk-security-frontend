"use client";

import DialogPortal from "@components/DialogPortal";

export default function TransferSuccessScreen({
  onGoToDashboard,
}: {
  onGoToDashboard: () => void;
}) {
  return (
    <DialogPortal
      title="Patient Record Transfer Successful"
      isOpen
      onClose={onGoToDashboard}
      backdropClassName="bg-white"
      containerClassName="px-6"
      panelClassName="w-full max-w-4xl rounded-[32px] bg-white px-6 py-16 text-center"
    >
        <div className="mx-auto mb-10 flex h-40 w-40 items-center justify-center rounded-full bg-[#FFF2C2] text-7xl">
          🎉
        </div>

        <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight text-[#111827]">
          Patient Record Transfer Successful!
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-2xl leading-relaxed text-gray-400">
          Patient transfer is still pending as recipient hospital are yet to confirm the
          request. This might take up to 24 hours.
        </p>

        <button
          type="button"
          onClick={onGoToDashboard}
          className="mt-10 w-full max-w-3xl rounded-full bg-[#211783] px-8 py-5 text-2xl text-white hover:bg-[#18105f]"
        >
          Go to Dashboard
        </button>
    </DialogPortal>
  );
}
