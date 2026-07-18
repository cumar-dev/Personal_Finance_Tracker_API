import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { List, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/Lib/Api/ApiCient";
import { cn } from "@/Lib/utils";
import TransactionCard from "./TransactionCard";

const TransactionTabs = () => {
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
      <div className="flex items-center justify-center py-16">
        <Loader2 size={22} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-destructive">
          Failed to load transactions.
        </p>
      </div>
    );
  }

  const total = Transactions.length;
  const incomeTransactions = Transactions.filter(
    (t) => t.type === "income"
  );
  const expenseTransactions = Transactions.filter(
    (t) => t.type === "expense"
  );

  const countBadge =
    "ml-1 rounded-full bg-black/10 px-1.5 py-0.5 text-[11px] font-semibold";

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f0f0]">
        <i
          className="ti ti-clipboard-list text-muted-foreground text-xl"
          aria-hidden="true"
        />
      </div>

      <p className="text-sm font-medium">No transactions</p>

      <p className="text-xs text-muted-foreground">
        No transaction found in this category.
      </p>
    </div>
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="h-12 w-[97%] ml-4 gap-1 rounded-full border bg-white p-1.5 shadow-sm">
        <TabsTrigger
          value="all"
          className={cn(
            "gap-2 rounded-full px-4",
            "data-[state=active]:bg-black data-[state=active]:text-white"
          )}
        >
          <List className="h-4 w-4" />
          All
          <span className={countBadge}>{total}</span>
        </TabsTrigger>

        <TabsTrigger
          value="income"
          className={cn(
            "gap-2 rounded-full px-4",
            "data-[state=active]:bg-green-600 data-[state=active]:text-white"
          )}
        >
          <TrendingUp className="h-4 w-4" />
          Income
          <span className={countBadge}>{incomeTransactions.length}</span>
        </TabsTrigger>

        <TabsTrigger
          value="expense"
          className={cn(
            "gap-2 rounded-full px-4",
            "data-[state=active]:bg-red-600 data-[state=active]:text-white"
          )}
        >
          <TrendingDown className="h-4 w-4" />
          Expense
          <span className={countBadge}>{expenseTransactions.length}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-4">
        {Transactions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Transactions.map((transaction) => (
              <TransactionCard
                key={transaction._id}
                transaction={transaction}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="income" className="mt-4">
        {incomeTransactions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomeTransactions.map((transaction) => (
              <TransactionCard
                key={transaction._id}
                transaction={transaction}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="expense" className="mt-4">
        {expenseTransactions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseTransactions.map((transaction) => (
              <TransactionCard
                key={transaction._id}
                transaction={transaction}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TransactionTabs;