import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Pencil } from "lucide-react";
import { pharmacyMedicines } from "@components/dashboard/pharmacy/inventoryData";
import BreadcrumbHeading from "@components/dashboard/pharmacy/BreadcrumbHeading";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PharmacyMedicineDetailPage({ params }: PageProps) {
  const { id } = await params;
  const medicine = pharmacyMedicines.find((item) => item.medicineId === id);

  if (!medicine) {
    notFound();
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <BreadcrumbHeading
            items={["Inventory", "List of Medicines", medicine.name]}
            description="List of medicines available for sales."
          />
        </div>

        <button className="inline-flex items-center gap-1 self-start rounded-full bg-[#00796B] px-5 py-2 text-xs font-medium text-white hover:bg-[#00695F]">
          <Pencil size={12} />
          Edit Details
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <article className="rounded border border-[#D8DEE8] bg-white">
          <div className="border-b border-[#D8DEE8] px-5 py-3 text-sm font-semibold text-[#2D3648]">
            Medicine
          </div>
          <div className="grid grid-cols-2 gap-6 px-5 py-4">
            <div>
              <p className="text-[36px] leading-none font-semibold text-[#23272E]">298</p>
              <p className="mt-2 text-sm text-[#6D778C]">Medicine ID</p>
            </div>
            <div>
              <p className="text-[36px] leading-none font-semibold text-[#23272E]">24</p>
              <p className="mt-2 text-sm text-[#6D778C]">Medicine Group</p>
            </div>
          </div>
        </article>

        <article className="rounded border border-[#D8DEE8] bg-white">
          <div className="flex items-center justify-between border-b border-[#D8DEE8] px-5 py-3 text-sm font-semibold text-[#2D3648]">
            <span>Inventory in Qty</span>
            <Link
              href="/dashboard/pharmacy/inventory/new"
              className="inline-flex items-center gap-1 text-xs font-normal text-[#4A556C]"
            >
              Send Stock Request
              <ChevronRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-6 px-5 py-4">
            <div>
              <p className="text-[36px] leading-none font-semibold text-[#23272E]">
                {medicine.lifetimeSupply}
              </p>
              <p className="mt-2 text-sm text-[#6D778C]">Lifetime Supply</p>
            </div>
            <div>
              <p className="text-[36px] leading-none font-semibold text-[#23272E]">
                {medicine.lifetimeSales}
              </p>
              <p className="mt-2 text-sm text-[#6D778C]">Lifetime Sales</p>
            </div>
            <div>
              <p className="text-[36px] leading-none font-semibold text-[#23272E]">
                {medicine.stockLeft.toString().padStart(2, "0")}
              </p>
              <p className="mt-2 text-sm text-[#6D778C]">Stock Left</p>
            </div>
          </div>
        </article>
      </div>

      <article className="rounded border border-[#D8DEE8] bg-white">
        <div className="border-b border-[#D8DEE8] px-5 py-3 text-sm font-semibold text-[#2D3648]">
          How to use
        </div>
        <p className="px-5 py-4 text-sm leading-6 text-[#3A4253]">{medicine.howToUse}</p>
      </article>

      <article className="rounded border border-[#D8DEE8] bg-white">
        <div className="border-b border-[#D8DEE8] px-5 py-3 text-sm font-semibold text-[#2D3648]">
          Side Effects
        </div>
        <p className="px-5 py-4 text-sm leading-6 text-[#3A4253]">
          {medicine.sideEffects}
        </p>
      </article>
    </section>
  );
}
