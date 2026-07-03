"use client";

import { useState } from "react";
import Modal from "@components/Modal";
import Image from "next/image";

interface HMOSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HMOSetupModal({ isOpen, onClose }: HMOSetupModalProps) {
  const [step, setStep] = useState<"form" | "verifying" | "success">("form");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("verifying");
    setTimeout(() => setStep("success"), 2500);
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
          : step === "verifying"
          ? "Verifying HMO's Status"
          : "Verifying HMO's Status"
      }
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-lg"
    >
      {step === "form" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name of HMO
            </label>
            <input
              type="text"
              placeholder="Add Name"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              HMO CODE/ID
            </label>
            <input
              type="text"
              placeholder="Enter ID"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Representative Name
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Representative Email
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Support Line
            </label>
            <input
              type="text"
              placeholder="Enter Direct Line"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website/Portal Link (Optional)
            </label>
            <input
              type="url"
              placeholder="Enter Url..."
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-full border text-gray-700"
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

      {step === "verifying" && (
        <div className="flex flex-col items-center justify-center py-10 space-y-3">
          <Image
            src="/spinner.svg"
            width={98}
            height={93}
            alt="loading"
            className="text-indigo-600 animate-spin"
          />
          <p className="text-indigo-600 text-lg font-medium">
            Verifying Status
          </p>
        </div>
      )}

      {step === "success" && (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
          <Image
            src="/icons/staffOnboarding_successicon.svg"
            alt="Success"
            width={208}
            height={208}
            className="mx-auto mb-6"
          />

          <h2 className="text-xl font-semibold text-gray-800">
            HMO Setup Details Successfully!
          </h2>
          <p className="text-gray-500 max-w-sm">
            HMO's verification successful and automatically added to dashboard.
            For more information refer to dashboard.
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
