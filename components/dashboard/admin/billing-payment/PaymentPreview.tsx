import { CreditCard } from "lucide-react";

export default function PaymentPreview() {
  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
      aria-labelledby="make-payment-title"
    >
      <h2
        id="make-payment-title"
        className="text-2xl font-semibold text-slate-950"
      >
        Make Payment
      </h2>

      <div className="mt-5 flex items-center gap-4 rounded-2xl border border-cyan-300 bg-cyan-50 px-5 py-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-500 text-white">
          <CreditCard className="h-7 w-7" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-[#21178C]">Pay with Paystack</p>
          <p className="mt-1 text-sm text-slate-500">
            Secure checkout via Paystack — cards, bank transfer &amp; USSD
            supported.
          </p>
        </div>
      </div>
    </section>
  );
}
