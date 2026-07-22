import Link from "next/link";

type BreadcrumbItem = string | { label: string; href?: string };

type BreadcrumbHeadingProps = {
  items: BreadcrumbItem[];
  description?: string;
};

const defaultHref = (label: string) => {
  if (label === "Inventory") return "/dashboard/pharmacy/inventory";
  if (label.startsWith("List of Medicines")) return "/dashboard/pharmacy/inventory/list";
  if (label === "Medicine Groups") return "/dashboard/pharmacy/inventory/groups";
  return undefined;
};

export default function BreadcrumbHeading({ items, description }: BreadcrumbHeadingProps) {
  return (
    <div>
      <h1 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[24px] font-semibold leading-tight sm:text-[30px] lg:text-[36px]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const label = typeof item === "string" ? item : item.label;
          const href = typeof item === "string" ? defaultHref(item) : item.href;

          return (
            <span key={`${label}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 && <span aria-hidden="true" className="text-[#8B93A7]">›</span>}
              {href && !isLast ? (
                <Link href={href} className="text-[#8B93A7] hover:text-[#00796B] hover:underline">
                  {label}
                </Link>
              ) : (
                <span className={isLast ? "text-[#1E2433]" : "text-[#8B93A7]"}>{label}</span>
              )}
            </span>
          );
        })}
      </h1>
      {description && <p className="mt-2 text-sm text-[#737791]">{description}</p>}
    </div>
  );
}
