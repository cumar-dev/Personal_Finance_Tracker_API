import { Link, useLocation } from "react-router-dom";
import { cn } from "@/Lib/utils";
import { LayoutDashboard, Receipt, User, Wallet, Plus } from "lucide-react";
const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Transactions", icon: Receipt, to: "/dashboard/transactions" },
  { label: "Profile", icon: User, to: "/dashboard/profile" },
];

const SideBar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-[oklch(0.22_0.06_255)] text-white">
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
          <Wallet className="h-4 w-4" />
        </div>
        <span className="text-[15px] font-bold tracking-tight">finTrack</span>
      </div>

      <nav className="mt-4 flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => {
          const active = pathname === to;
          return (
            <Link
              key={label}
              to={to}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/55 hover:bg-white/5 hover:text-white/90",
              )}
            >
              {active && (
                <span className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[oklch(0.65_0.15_150)]" />
              )}
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SideBar;
