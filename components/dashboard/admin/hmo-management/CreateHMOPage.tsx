"use client";

import { useState } from "react";
import Modal from "@components/Modal";
import Image from "next/image";

interface CreateHMOPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateHMOPage({
  isOpen,
  onClose,
}: CreateHMOPageProps) {
  const [step, setStep] = useState<"form" | "verifying" | "success">("form");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setStep("verifying");

    setTimeout(() => {
      setStep("success");
    }, 2500);
  };

  const handleClose = () => {
    onClose();
    setStep("form");
  };

  return (
    <Modal
      title={
        step === "form"
          ? "Add New HMO"
          : "Verifying HMO's Status"
      }
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-lg"
    >

      {/* FORM */}
      {step === "form" && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name of HMO
            </label>

            <input
              type="text"
              placeholder="Add Name"
              required
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">
              HMO CODE/ID
            </label>

            <input
              type="text"
              placeholder="Enter ID"
              required
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Representative Name
            </label>

            <input
              type="text"
              placeholder="Enter Name"
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Representative Email
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Support Line
            </label>

            <input
              type="text"
              placeholder="Enter Direct Line"
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website/Portal Link (Optional)
            </label>

            <input
              type="url"
              placeholder="Enter URL"
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>


          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-full border"
            >
              Cancel
            </button>


            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#1A2380] text-white"
            >
              Continue
            </button>

          </div>

        </form>
      )}



      {/* VERIFYING */}
      {step === "verifying" && (
        <div className="flex flex-col items-center justify-center py-10 space-y-3">

          <Image
            src="/spinner.svg"
            width={98}
            height={93}
            alt="loading"
            className="animate-spin"
          />

          <p className="text-indigo-600 text-lg font-medium">
            Verifying Status
          </p>

        </div>
      )}



      {/* SUCCESS */}
      {step === "success" && (
        <div className="flex flex-col items-center text-center py-10 space-y-4">

          <Image
            src="/icons/staffOnboarding_successicon.svg"
            width={208}
            height={208}
            alt="success"
          />


          <h2 className="text-xl font-semibold">
            HMO Setup Details Successfully!
          </h2>


          <p className="text-gray-500">
            HMO verification successful and automatically added to dashboard.
          </p>


          <button
            onClick={handleClose}
            className="bg-[#1A2380] text-white px-6 py-2 rounded-full"
          >
            Go to HMO Dashboard
          </button>

        </div>
      )}

    </Modal>
  );
}