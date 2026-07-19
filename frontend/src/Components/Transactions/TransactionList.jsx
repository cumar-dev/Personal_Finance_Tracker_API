import { Api } from "@/Lib/Api/ApiCient";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Receipt, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { Card, CardContent } from "@/Components/ui/card";

const TransactionList = () => {
  const {
    data: Transactions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transaction"],
    retry: 1,
    queryFn: async () => {
      const response = await Api.get("/transaction/all");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <p className="text-sm text-destructive">
          Failed to load transactions. Please try again.
        </p>
      </div>
    );
  }

  const total = Transactions.length;
  const income = Transactions.filter((t) => t.type === "income").length;
  const expense = Transactions.filter((t) => t.type === "expense").length;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <Receipt className="h-6 w-6 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-6">
     <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground">
              {total}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              All transactions
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Income
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[oklch(0.55_0.15_150)]/10">
                <TrendingUp className="h-4 w-4 text-[oklch(0.55_0.15_150)]" />
              </div>
            </div>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[oklch(0.55_0.15_150)]">
              {income}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Entries received
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Expense
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[oklch(0.55_0.18_25)]/10">
                <TrendingDown className="h-4 w-4 text-[oklch(0.55_0.18_25)]" />
              </div>
            </div>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[oklch(0.55_0.18_25)]">
              {expense}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Entries spent
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionList;
