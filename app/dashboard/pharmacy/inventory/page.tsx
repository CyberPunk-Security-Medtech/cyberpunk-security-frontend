import Link from "next/link";
import { AlertTriangle, ChevronRight, Package, Pill } from "lucide-react";

const inventoryCards = [
  {
    title: "298",
    subtitle: "Medicines Available",
    action: "View Full List",
    icon: Package,
    iconColor: "text-[#2F80ED]",
    iconBg: "bg-[#EBF4FF]",
    actionBg: "bg-[#E8F3FF]",
    actionColor: "text-[#2F80ED]",
    href: "/dashboard/pharmacy/inventory/list",
  },
  {
    title: "02",
    subtitle: "Medicine Groups",
    action: "View Groups",
    icon: Pill,
    iconColor: "text-[#00A86B]",
    iconBg: "bg-[#EAFBF2]",
    actionBg: "bg-[#ECFFF4]",
    actionColor: "text-[#00A86B]",
    href: "/dashboard/pharmacy/inventory/groups",
  },
  {
    title: "01",
    subtitle: "Medicine Shortage",
    action: "Restock Now",
    icon: AlertTriangle,
    iconColor: "text-[#EF4444]",
    iconBg: "bg-[#FFF1F2]",
    actionBg: "bg-[#FFF2F2]",
    actionColor: "text-[#EF4444]",
    href: "/dashboard/pharmacy/inventory/list",
  },
];

export default function PharmacyInventoryPage() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-[36px] leading-none font-semibold text-[#151D48]">
            Inventory
          </h1>
          <p className="mt-2 text-sm text-[#737791]">
            List of medicines available for sales.
          </p>
        </div>

        <Link
          href="/dashboard/pharmacy/inventory/new"
          className="inline-flex items-center gap-1 self-start rounded-full bg-[#00796B] px-4 py-2 text-xs font-medium text-white hover:bg-[#00695F]"
        >
          + New Drug Prescription
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-[520px] lg:grid-cols-3">
        {inventoryCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.subtitle}
              className="w-full overflow-hidden rounded-sm border border-[#DDE3ED] bg-white"
            >
              <div className="px-5 py-4 text-center">
                <span
                  className={`mx-auto mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full ${card.iconBg}`}
                >
                  <Icon size={15} className={card.iconColor} />
                </span>
                <p className="text-[24px] leading-none font-semibold text-[#23272E]">
                  {card.title}
                </p>
                <p className="mt-2 text-[11px] text-[#8A93A5]">{card.subtitle}</p>
              </div>

              <Link
                href={card.href}
                className={`flex items-center justify-center gap-1 border-t border-[#E8ECF3] px-3 py-1.5 text-[10px] font-medium ${card.actionBg} ${card.actionColor}`}
              >
                {card.action}
                <ChevronRight size={12} />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
