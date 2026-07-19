import { Api } from "@/Lib/Api/ApiCient";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Loader2, Receipt, TrendingDown, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

const types = {
  income: {
    label: "Income",
    icon: TrendingUp,
    // sign: "+",
    textClass: "text-[oklch(0.5_0.15_150)]",
    bgClass: "bg-[oklch(0.55_0.15_150)]/10",
  },
  expense: {
    label: "Expense",
    icon: TrendingDown,
    // sign: "-",
    textClass: "text-[oklch(0.5_0.18_25)]",
    bgClass: "bg-[oklch(0.55_0.18_25)]/10",
  },
};

const RecentTransaction = () => {
  const {
    data: recentTransaction = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recentTransaction"],
    retry: 1,
    queryFn: async () => {
      const response = await Api.get("/transaction/recent");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <p className="text-sm text-destructive">
          Failed to load recent transactions.
        </p>
      </div>
    );
  }

  if (recentTransaction.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <Receipt className="h-6 w-6 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Recent transaction
        </h2>
        <p className="text-sm text-muted-foreground">
          Your latest activity across all accounts
        </p>
      </div>
      <div className="p-5">
        <div className="overflow-hidden rounded-2xl border border-border/60 p-4">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-3.5">Title</TableHead>
                <TableHead className="py-3.5">Category</TableHead>
                <TableHead className="py-3.5">Type</TableHead>
                <TableHead className="py-3.5">Date</TableHead>
                <TableHead className="py-3.5 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {recentTransaction.map((item) => {
                const currentType = types[item.type];
                const Icon = currentType.icon;

                return (
                  <TableRow key={item._id}>
                    <TableCell className="py-3.5 font-medium text-foreground">
                      {item.title}
                    </TableCell>

                    <TableCell className="py-3.5">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {item.category}
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${currentType.bgClass} ${currentType.textClass}`}
                      >
                        <Icon className="h-3 w-3" />
                        {currentType.label}
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5 text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>

                    <TableCell
                      className={`py-3.5 text-right font-mono font-semibold tabular-nums ${currentType.textClass}`}
                    >
                      ${Number(item.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default RecentTransaction;
