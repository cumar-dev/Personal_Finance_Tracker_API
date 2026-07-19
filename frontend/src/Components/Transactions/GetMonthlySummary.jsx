import { Api } from "@/Lib/Api/ApiCient";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Loader2,
  PieChart,
  Wallet,
  HandCoins,
  Scale,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function StatCard({ icon: Icon, label, value, accentClass, bgClass }) {
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${bgClass}`}
          >
            <Icon className={`h-4 w-4 ${accentClass}`} />
          </div>
        </div>
        <p
          className={`mt-3 font-mono text-2xl font-bold tabular-nums ${accentClass}`}
        >
          ${value.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
}

function CategoryBars({ items, color }) {
  const max = Math.max(...items.map((i) => i.total), 1);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.category}>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[13px] font-medium text-foreground">
              {item.category}
            </span>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              ${item.total.toFixed(2)}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(item.total / max) * 100}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const GetMonthlySummary = () => {
  const {
    data: monthlySummary = { income: [], expense: [] },
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["monthlyTransaction"],
    retry: 1,
    queryFn: async () => {
      const response = await Api.get("/transaction/monthly-summary");
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
          Failed to load monthly summary.
        </p>
      </div>
    );
  }

  const { income = [], expense = [] } = monthlySummary;
  const isEmpty = income.length === 0 && expense.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <PieChart className="h-6 w-6 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          No transactions this month yet
        </p>
      </div>
    );
  }

  const totalIncome = income.reduce((sum, i) => sum + i.total, 0);
  const totalExpense = expense.reduce((sum, i) => sum + i.total, 0);
  const balance = totalIncome - totalExpense;
  const isPositive = balance >= 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Totals */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Wallet}
          label="Total Income"
          value={totalIncome}
          accentClass="text-[oklch(0.5_0.15_150)]"
          bgClass="bg-[oklch(0.55_0.15_150)]/10"
        />
        <StatCard
          icon={HandCoins}
          label="Total Expense"
          value={totalExpense}
          accentClass="text-[oklch(0.5_0.18_25)]"
          bgClass="bg-[oklch(0.55_0.18_25)]/10"
        />
        <StatCard
          icon={Scale}
          label="Balance"
          value={balance}
          accentClass={
            isPositive
              ? "text-[oklch(0.5_0.15_150)]"
              : "text-[oklch(0.5_0.18_25)]"
          }
          bgClass={
            isPositive
              ? "bg-[oklch(0.55_0.15_150)]/10"
              : "bg-[oklch(0.55_0.18_25)]/10"
          }
        />
      </div>

      {/* Category breakdown */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="p-5 pb-0">
            <p className="text-sm font-semibold text-foreground">
              Income by category
            </p>
          </CardHeader>
          <CardContent className="p-5">
            {income.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No income this month
              </p>
            ) : (
              <CategoryBars items={income} color="oklch(0.55 0.15 150)" />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="p-5 pb-0">
            <p className="text-sm font-semibold text-foreground">
              Expense by category
            </p>
          </CardHeader>
          <CardContent className="p-5">
            {expense.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No expenses this month
              </p>
            ) : (
              <CategoryBars items={expense} color="oklch(0.55 0.18 25)" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GetMonthlySummary;
