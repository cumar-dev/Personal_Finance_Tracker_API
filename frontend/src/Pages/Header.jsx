import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/store/AuthStore";
import { ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "../Lib/utils";
import ThemeToggle from "@/Components/ThemeToggle";
const NAV_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
];

const Header = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <Link to="/home" className="flex items-center shrink-0">
          <img src="/Logo.png" alt="finTrack" className="w-28 h-auto" />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "relative py-2 text-sm font-medium transition-colors",
                  "after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:rounded-full after:bg-primary after:transition-all after:duration-300",
                  isActive
                    ? "text-foreground after:w-full"
                    : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Dark / Light Mode */}
          <ThemeToggle />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "flex items-center gap-2 rounded-full pl-1.5 pr-3 h-10 border border-border",
                "hover:bg-muted hover:border-border/80 transition-colors",
                "data-[state=open]:bg-muted data-[state=open]:border-border/80",
              )}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {/* {getInitials(user?.name)} */}
                {user?.profile?.url ? (
                  <img
                    src={user.profile.url}
                    alt={user.name}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-xs font-semibold text-primary-foreground">
                    {getInitials(user?.name)}
                  </span>
                )}
              </div>

              <span className="hidden sm:block text-sm font-medium">
                {user?.name?.split(" ")[0] ?? "User"}
              </span>

              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="w-64 p-1.5 rounded-xl border border-border shadow-lg shadow-black/[0.04]"
            >
              <div className="flex items-center gap-3 px-2.5 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0 ring-2 ring-primary/10">
                  {user?.profile?.url ? (
                  <img
                    src={user.profile.url}
                    alt={user.name}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-xs font-semibold text-primary-foreground">
                    {getInitials(user?.name)}
                  </span>
                )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-none text-foreground">
                    {user?.name ?? "User"}
                  </p>

                  <p className="truncate text-xs text-muted-foreground mt-1.5">
                    {user?.email ?? ""}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator className="mx-0 mb-1.5" />

              <DropdownMenuGroup className="flex flex-col gap-0.5">
                <DropdownMenuItem className="gap-2.5 rounded-lg px-2.5 py-2 text-sm cursor-pointer focus:bg-muted">
                  <Link to="/dashboard" className="flex items-center gap-2.5">
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="gap-2.5 rounded-lg px-2.5 py-2 text-sm cursor-pointer focus:bg-muted">
                  <Link to="/profile" className="flex items-center gap-2.5">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Profile
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="mx-0 my-1.5" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="gap-2.5 rounded-lg px-2.5 py-2 text-sm cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
