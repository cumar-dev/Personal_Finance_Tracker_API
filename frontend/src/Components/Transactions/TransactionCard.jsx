import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  TrendingDown,
  TrendingUp,
  Calendar,
  Trash,
  Pencil,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const types = {
  income: {
    label: "Income",
    icon: TrendingUp,
    textClass: "text-green-600",
    bgClass: "bg-green-100",
  },
  expense: {
    label: "Expense",
    icon: TrendingDown,
    textClass: "text-red-600",
    bgClass: "bg-red-100",
  },
};

const TransactionCard = ({ transaction }) => {
  const currentType = types[transaction.type];
  const Icon = currentType.icon;

  return (
    <Card className="rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{transaction.title}</h2>
          <p className="text-sm text-muted-foreground">
            {transaction.category}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 ${currentType.bgClass}`}
          >
            <Icon className={`h-4 w-4 ${currentType.textClass}`} />
            <span className={`text-sm font-medium ${currentType.textClass}`}>
              {currentType.label}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="rounded-md"
              >
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-36 rounded-xl p-1.5">
              <DropdownMenuItem>
                <Pencil size={14} />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem variant="destructive">
                <Trash size={14} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-muted-foreground">Amount</p>
        <h3 className={`text-3xl font-bold ${currentType.textClass}`}>
          ${transaction.amount}
        </h3>
      </div>

      <div className="mt-6 border-t pt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(transaction.date).toLocaleDateString()}</span>
        </div>

        <p className="text-xs text-muted-foreground">
          Created: {new Date(transaction.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Card>
  );
};

export default TransactionCard;