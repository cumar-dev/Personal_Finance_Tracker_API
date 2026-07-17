import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const TransactionForm = ({ open, onOpenChange }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const isExpense = type === "expense";

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: ku xidh mutation-kaaga dhabta ah halkan
    // saveTransaction({ title, amount: Number(amount), type, category, date });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              Add transaction
            </DialogTitle>
            <DialogDescription>
              Log a new expense or income entry.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 px-6 py-5">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Grocery"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-11 rounded-xl"
                required
              />
            </div>

            {/* Amount */}
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>

                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              {/* Category */}
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>

                <Input
                  id="category"
                  placeholder="Groceries"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-11 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>

              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 rounded-xl"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-border/60 px-6 py-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-full px-6">
              Save transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
