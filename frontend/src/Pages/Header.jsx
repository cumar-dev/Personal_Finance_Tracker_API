import React from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
const Header = () => {
  return (
    <>
  <header className="sticky top-0 z-50 bg-muted/40 w-full border-b border-[#e5e5e5] shadow-sm my-5">
  {/* logo */}
  <div className="max-w-7xl mx-auto flex items-center justify-between py-4">
    <Link
      to="/home"
    >
      <img
        src="/Logo.png"
        alt="finTrack"
        className="w-32 h-auto"
      />
    </Link>
    {/* links */}
    <div className="space-x-3 flex items-center">
        <Link to="/home">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
    </div>
    {/* dropdownMenu */}
  </div>
</header>
    </>
  );
};

export default Header;
