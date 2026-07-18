import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "@/Lib/Api/ApiCient";
import { Loader2 } from "lucide-react";
const TransactionForm = ({ open, onOpenChange, transaction }) => {
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: transaction?.title ?? "",
    amount: transaction?.amount ?? "",
    type: transaction?.type ?? "expense",
    category: transaction?.category ?? "",
    date: transaction?.date
      ? new Date(transaction.date).toISOString().split("T")[0]
      : "",
  });

  useEffect(() => {
  if (transaction) {
    setFormData({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: new Date(transaction.date)
        .toISOString()
        .split("T")[0],
    });
  } else {
    setFormData({
      title: "",
      amount: "",
      type: "expense",
      category: "",
      date: "",
    });
  }
}, [transaction, open]);
  const queryClient = useQueryClient();

  const createTransaction = useMutation({
    mutationFn: async (transactionData) => {
      const response = await Api.post("/transaction/create", transactionData);
      console.log("created transaction: ", response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      toast.success("Transaction created successfully");
      setFormData({
        title: "",
        amount: "",
        type: "expense",
        category: "",
        date: "",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Transaction failed");
    },
  });

  const updateTransaction = useMutation({
    mutationFn: async (transactionData) => {
      const response = await Api.put(
        `/transaction/update/${transaction._id}`,
        transactionData,
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transaction"],
      });

      toast.success("Transaction updated successfully");
      onOpenChange(false);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update transaction",
      );
    },
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // const handleTypeChange = (value) => {
  //   setFormData((prev) => ({...prev, type: value}));
  // }
  const handleCancel = () => {
    setFormData({
      title: "",
      amount: "",
      type: "expense",
      category: "",
      date: "",
    });
    setError(null);
    onOpenChange(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.amount ||
      !formData.type ||
      !formData.category ||
      !formData.date
    ) {
      setError("please fill the fields");
      toast.error("fil the fields");
      return;
    }

    if (Number(formData.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    console.log("form data", formData);

    const TransactionData = {
      title: formData.title.trim(),
      amount: Number(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
    };

    if (transaction) {
      updateTransaction.mutate(TransactionData);
    } else {
      createTransaction.mutate(TransactionData);
    }

    setFormData({
      title: "",
      amount: "",
      type: "expense",
      category: "",
      date: "",
    });
    onOpenChange(false);
    // toast.success("Transaction created succesfully..")
  };
  const isLoading = transaction
    ? updateTransaction.isPending
    : createTransaction.isPending;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-lg font-semibold">
              {transaction ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
            <DialogDescription>
              {transaction
                ? "Update your transaction details."
                : "Log a new income or expense."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 px-6 py-5">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                name="title"
                id="title"
                placeholder="e.g. Grocery"
                value={formData.title}
                onChange={handleChange}
                className="h-11 rounded-xl"
                required
              />
            </div>

            {/* Amount */}
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                name="amount"
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>

                <select
                  name="type"
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
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
                  name="category"
                  id="category"
                  placeholder="Groceries"
                  value={formData.category}
                  onChange={handleChange}
                  className="h-11 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>

              <Input
                name="date"
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
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
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full px-6"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin" />
                  {transaction ? "Updating..." : "Creating..."}
                </span>
              ) : transaction ? (
                "Update transaction"
              ) : (
                "Create transaction"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
