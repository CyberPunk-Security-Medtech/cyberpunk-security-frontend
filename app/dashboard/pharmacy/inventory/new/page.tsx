import BreadcrumbHeading from "@components/dashboard/pharmacy/BreadcrumbHeading";

export default function AddNewMedicinePage() {
  return (
    <section className="space-y-8">
      <div>
        <BreadcrumbHeading
          items={["Inventory", "List of Medicines", "Add New Medicine"]}
          description="*All fields are mandatory, except mentioned as (optional)."
        />
      </div>

      <form className="max-w-[820px] space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-[#2D3648]">Medicine Name</label>
            <input
              className="h-11 w-full rounded border border-[#CED7E3] bg-[#E9EFF7] px-3 text-sm text-[#2D3648] outline-none"
              type="text"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-[#2D3648]">Medicine ID</label>
            <input
              className="h-11 w-full rounded border border-[#CED7E3] bg-[#E9EFF7] px-3 text-sm text-[#2D3648] outline-none"
              type="text"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-[#2D3648]">Medicine Group</label>
            <select className="h-11 w-full rounded border border-[#CED7E3] bg-[#E9EFF7] px-3 text-sm text-[#4B5568] outline-none">
              <option>- Select Group -</option>
              <option>Generic Medicine</option>
              <option>Diabetes</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-[#2D3648]">Quantity in Number</label>
            <input
              className="h-11 w-full rounded border border-[#CED7E3] bg-[#E9EFF7] px-3 text-sm text-[#2D3648] outline-none"
              type="number"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#2D3648]">How to Use</label>
          <textarea className="h-28 w-full resize-none rounded border border-[#CED7E3] bg-[#E9EFF7] p-3 text-sm text-[#2D3648] outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#2D3648]">Side Effects</label>
          <textarea className="h-28 w-full resize-none rounded border border-[#CED7E3] bg-[#E9EFF7] p-3 text-sm text-[#2D3648] outline-none" />
        </div>

        <button
          type="button"
          className="rounded-full bg-[#00796B] px-7 py-3 text-xs font-medium text-white hover:bg-[#00695F]"
        >
          Save Details
        </button>
      </form>
    </section>
  );
}
