import { Link, useLocation } from "react-router-dom";
import { cn } from "@/Lib/utils";
import {
  BarChart3,
  Home,
  LayoutDashboard,
  Receipt,
  User,
  Wallet,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Transactions", icon: Receipt, to: "/dashboard/transactions" },
  { label: "Report", icon: BarChart3, to: "/dashboard/report" },
  { label: "Profile", icon: User, to: "/dashboard/profile" },
  { label: "Home", icon: Home, to: "/home" },
];

const SideBar = () => {
  const { pathname } = useLocation();
  const theme = localStorage.getItem("theme");

  return (
    <aside
      className={`sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border ${theme == "dark" ? "bg-black" : "bg-white"}`}
    >
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
          <Wallet className="h-4 w-4" />
        </div>
        <span className="text-[15px] font-bold tracking-tight text-foreground">
          finTrack
        </span>
      </div>

      <nav className="mt-4 flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => {
          const active = pathname === to;
          return (
            <Link
              key={label}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
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
