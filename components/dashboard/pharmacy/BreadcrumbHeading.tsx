type BreadcrumbHeadingProps = {
  items: string[];
  description?: string;
};

export default function BreadcrumbHeading({
  items,
  description,
}: BreadcrumbHeadingProps) {
  return (
    <div>
      <h1 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[24px] font-semibold leading-tight sm:text-[30px] lg:text-[36px]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 && <span className="text-[#8B93A7]">›</span>}
              <span className={isLast ? "text-[#1E2433]" : "text-[#8B93A7]"}>
                {item}
              </span>
            </span>
          );
        })}
      </h1>
      {description ? (
        <p className="mt-2 text-sm text-[#737791]">{description}</p>
      ) : null}
    </div>
  );
}
