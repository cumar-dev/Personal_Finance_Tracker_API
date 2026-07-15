import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "../Lib/utils";
const ThemeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-border",
          "hover:bg-muted hover:border-border/80 transition-colors",
          "data-[state=open]:bg-muted data-[state=open]:border-border/80",
        )}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="
          w-48
          p-1.5
          rounded-xl
          border border-border
          shadow-lg
          shadow-black/[0.04]
        "
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="
            gap-2.5
            rounded-lg
            px-2.5
            py-2
            text-sm
            cursor-pointer
            focus:bg-muted
          "
        >
          <Sun className="h-4 w-4 text-muted-foreground" />
          Light
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="
            gap-2.5
            rounded-lg
            px-2.5
            py-2
            text-sm
            cursor-pointer
            focus:bg-muted
          "
        >
          <Moon className="h-4 w-4 text-muted-foreground" />
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="
            gap-2.5
            rounded-lg
            px-2.5
            py-2
            text-sm
            cursor-pointer
            focus:bg-muted
          "
        >
          <Monitor className="h-4 w-4 text-muted-foreground" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
