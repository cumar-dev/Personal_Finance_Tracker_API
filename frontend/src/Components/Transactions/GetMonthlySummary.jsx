import { Api } from "@/Lib/Api/ApiCient";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Loader2,
  PieChart,
  Wallet,
  HandCoins,
  Scale,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function StatCard({ icon: Icon, label, value, accentClass, bgClass }) {
  return (
     <div className="p-3">
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
    </div>
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

// goodDirection: "up" (income — rising is good) or "down" (expense — falling is good)
function ComparisonRow({ label, current, previous, color, goodDirection }) {
  const max = Math.max(current, previous, 1);
  const change =
    previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100;
  const rose = change > 0;
  const isGood = goodDirection === "up" ? rose : !rose;
  const changeColor = isGood
    ? "text-[oklch(0.5_0.15_150)]"
    : "text-[oklch(0.5_0.18_25)]";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {change !== 0 && (
          <span className={`flex items-center gap-0.5 font-mono text-xs font-semibold ${changeColor}`}>
            {rose ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {Math.abs(change).toFixed(0)}%
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="w-16 shrink-0 text-[11px] text-muted-foreground">
            Previous
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full opacity-40"
              style={{ width: `${(previous / max) * 100}%`, backgroundColor: color }}
            />
          </div>
          <span className="w-16 shrink-0 text-right font-mono text-[11px] text-muted-foreground">
            ${previous.toFixed(0)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-16 shrink-0 text-[11px] text-muted-foreground">
            Current
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{ width: `${(current / max) * 100}%`, backgroundColor: color }}
            />
          </div>
          <span className="w-16 shrink-0 text-right font-mono text-[11px] font-semibold text-foreground">
            ${current.toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
}

function PeriodComparisonCard({ title, description, current, previous }) {
  return (
     <div className="p-3">
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardHeader className="p-5 pb-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-5 p-5">
        <ComparisonRow
          label="Income"
          current={current.income}
          previous={previous.income}
          color="oklch(0.55 0.15 150)"
          goodDirection="up"
        />
        <ComparisonRow
          label="Expense"
          current={current.expense}
          previous={previous.expense}
          color="oklch(0.55 0.18 25)"
          goodDirection="down"
        />
      </CardContent>
    </Card>
    </div>
  );
}

const EMPTY_PERIOD = { current: { income: 0, expense: 0 }, previous: { income: 0, expense: 0 } };

const GetMonthlySummary = () => {
  const {
    data: monthlySummary = {
      income: [],
      expense: [],
      comparison: {
        week: EMPTY_PERIOD,
        month: EMPTY_PERIOD,
        sixMonth: EMPTY_PERIOD,
        year: EMPTY_PERIOD,
      },
    },
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

  const { income = [], expense = [], comparison } = monthlySummary;
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

      {/* Period comparisons: Week / Month / 6 Months / Year */}
      {comparison && (
        <div className="grid gap-4 sm:grid-cols-2">
          <PeriodComparisonCard
            title="This week vs last week"
            description="Last 7 days compared to the 7 days before"
            current={comparison.week.current}
            previous={comparison.week.previous}
          />
          <PeriodComparisonCard
            title="This month vs last month"
            description="Current calendar month compared to the previous one"
            current={comparison.month.current}
            previous={comparison.month.previous}
          />
          <PeriodComparisonCard
            title="Last 6 months vs previous 6 months"
            description="Recent half-year trend compared to the one before it"
            current={comparison.sixMonth.current}
            previous={comparison.sixMonth.previous}
          />
          <PeriodComparisonCard
            title="This year vs last year"
            description="Last 12 months compared to the 12 months before"
            current={comparison.year.current}
            previous={comparison.year.previous}
          />
        </div>
      )}

     
      <div className="grid gap-4 p-3 sm:grid-cols-2">
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="flex-row items-start justify-between gap-3 p-5 pb-0">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Income by category
              </p>
              <p className="text-xs text-muted-foreground">
                Where this month's income came from
              </p>
            </div>
            {income.length > 0 && (
              <span className="shrink-0 rounded-full bg-[oklch(0.55_0.15_150)]/10 px-2.5 py-1 font-mono text-xs font-semibold text-[oklch(0.5_0.15_150)]">
                ${income.reduce((sum, i) => sum + i.total, 0).toFixed(2)}
              </span>
            )}
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
          <CardHeader className="flex-row items-start justify-between gap-3 p-5 pb-0">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Expense by category
              </p>
              <p className="text-xs text-muted-foreground">
                Where this month's spending went
              </p>
            </div>
            {expense.length > 0 && (
              <span className="shrink-0 rounded-full bg-[oklch(0.55_0.18_25)]/10 px-2.5 py-1 font-mono text-xs font-semibold text-[oklch(0.5_0.18_25)]">
                ${expense.reduce((sum, i) => sum + i.total, 0).toFixed(2)}
              </span>
            )}
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
