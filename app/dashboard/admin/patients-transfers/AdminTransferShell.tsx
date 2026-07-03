import Sidebar from "@components/dashboard/admin/Sidebar";
import Header from "@components/Header";

export default function AdminTransferShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar />
      <main className="min-w-0 flex-1 flex flex-col">
        <Header />
        <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
