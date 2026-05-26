import { Activity, Stethoscope, Users, ShieldCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCardsRow() {
  const data = [
    { title: "Total Patients Transfers", value: "43", delta: "+12%", icon: Activity, positive: true },
    { title: "Today’s Appointments", value: "10", delta: "+3", icon: Stethoscope, positive: true },
    { title: "Active Staffs", value: "89", delta: "-5%", icon: Users, positive: false },
    { title: "Total HMO’s Active", value: "15", delta: "+2", icon: ShieldCheck, positive: true },
  ];

  return (
    <section className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
      {data.map((item) => {
        const Icon = item.icon;
        const Arrow = item.positive ? ArrowUpRight : ArrowDownRight;
        const deltaColor = item.positive ? "text-emerald-600" : "text-rose-600";

        return (
          <div key={item.title} className="bg-white rounded-2xl p-4 border flex flex-col gap-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>{item.title}</span>
              <Icon className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-semibold">{item.value}</p>
            <span className={`flex items-center gap-1 text-xs ${deltaColor}`}>
              <Arrow className="w-3 h-3" />
              {item.delta}
            </span>
          </div>
        );
      })}
    </section>
  );
}
