import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/Lib/Store/AuthStore";
import { useState } from "react";
import TransactionForm from "@/Components/Transactions/TransactionForm";
import TransactionTabs from "@/Components/Transactions/TransactionTabs";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
const Transaction = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user } = useAuthStore();
  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingTask(null);
  };
  return (
    <div className="bg-muted/40">
      <Card className="bg-white shadow-sm">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {getGreeting()}, {user?.name?.split(" ")[0] ?? "User"}
            </h1>
          </div>

          <Button
            onClick={() => setShowCreateForm(true)}
            className="gap-1.5 rounded-full bg-foreground px-5 text-background hover:bg-foreground/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Add expense
          </Button>
        </CardContent>
      </Card>

      {/* calling differnt pages in here */}
      <div className="pb-5">
        <TransactionForm
        open={showCreateForm || !!editingTask}
        onOpenChange={handleFormClose}
        task={editingTask}
      />
      </div>
     
      <TransactionTabs />
    </div>
  );
};

export default Transaction;
