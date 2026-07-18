import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  TrendingDown,
  TrendingUp,
  Calendar,
  Trash,
  Pencil,
  MoreVertical,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TransactionForm from "./TransactionForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "@/Lib/Api/ApiCient";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const queryClient = useQueryClient();

  const transactionDelete = useMutation({
    mutationFn: async () => {
      const response = await Api.delete(
        `/transaction/delete/${transaction._id}`,
      );
      console.log("delete", response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      toast.success("transaction deleted successfully...");
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast.error("transaction deleting process is failed", error);
    },
  });

  return (
    <>
      <Card className="p-5 rounded-2xl border-border/60 shadow-sm">
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
                <Button variant="ghost" size="icon-xs" className="rounded-md">
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-36 rounded-xl p-1.5"
              >
                <DropdownMenuItem onClick={()=> setShowEditForm(true)}>
                  <Pencil size={14} />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                >
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

      {/* edit form  */}
      <TransactionForm
        open={showEditForm}
        onOpenChange={setShowEditForm}
        transaction={transaction}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold text-foreground">
                "{transaction.title}"
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => transactionDelete.mutate()}
              className="rounded-xl bg-destructive text-white hover:bg-destructive/90"
            >
              {transactionDelete.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionCard;
