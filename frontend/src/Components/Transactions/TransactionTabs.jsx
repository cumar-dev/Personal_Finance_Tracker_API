import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "@/Lib/Api/ApiCient";
import { cn } from "@/Lib/utils";
import Transaction from "@/Dashboard/Transaction";
import TransactionCard from "./TransactionCard";

const TransactionTabs = () => {
  const queryClient = useQueryClient();
  const {
    data: Transactions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transaction"],
    retry: 1,
    queryFn: async () => {
      const response = await Api.get("/transaction/all");
      console.log("response from backend", response);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={22} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-destructive">
          Failed to load tasks. Please try again.
        </p>
      </div>
    );
  }
  const total = Transactions.length;
  const income = Transactions.filter((t) => t.type === "income").length;
  const expense = Transactions.filter((t) => t.type === "expense").length;

   const countBadge =
    "ml-0.5 rounded-full bg-black/10 px-1.5 py-0.5 text-[11px] font-semibold leading-none data-[state=inactive]:bg-muted-foreground/10";

  return (
    <Tabs defaultValue="all">
      <TabsList className="h-12 gap-1 w-[97%] ml-4 rounded-full border border-border/60 bg-white p-1.5 shadow-sm">
        <TabsTrigger
          value="all"
          className={cn(
            "gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition-all duration-200",
            "hover:text-foreground",
            "data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-md"
          )}
        >
          <List className="h-3.5 w-3.5" />
          All
          <span className={countBadge}>{total}</span>
        </TabsTrigger>

        <TabsTrigger
          value="income"
          className={cn(
            "gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition-all duration-200",
            "hover:text-[oklch(0.5_0.15_150)]",
            "data-[state=active]:bg-[oklch(0.55_0.15_150)] data-[state=active]:text-white data-[state=active]:shadow-md"
          )}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Income
          <span className={countBadge}>{income}</span>
        </TabsTrigger>

        <TabsTrigger
          value="expense"
          className={cn(
            "gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition-all duration-200",
            "hover:text-[oklch(0.5_0.18_25)]",
            "data-[state=active]:bg-[oklch(0.55_0.18_25)] data-[state=active]:text-white data-[state=active]:shadow-md"
          )}
        >
          <TrendingDown className="h-3.5 w-3.5" />
          Expense
          <span className={countBadge}>{expense}</span>
        </TabsTrigger>
      </TabsList>
        {
        Transactions.length === 0 ?(
           <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f0f0]">
                <i className="ti ti-clipboard-list text-muted-foreground text-xl" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-foreground">No transactions</p>
              <p className="text-xs text-muted-foreground">
                No transaction found in this category.
              </p>
            </div>
        ):(
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                    Transactions.map((transaction) => {
                        <TransactionCard key={transaction._id} transaction={transaction} />
                    })
                }
            </div>
        )
      }
    </Tabs>

  );
};

export default TransactionTabs;
