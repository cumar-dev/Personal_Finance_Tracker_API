import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/Lib/Store/AuthStore";
import { useState } from "react";
import TransactionForm from "@/Components/Transactions/TransactionForm";
import TransactionTabs from "@/Components/Transactions/TransactionTabs";
import SearchTransaction from "@/Components/Transactions/SearchTransaction";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
const Transaction = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuthStore();
  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingTransaction(null);
  };
  return (
    <div className="bg-muted/40">
      <Card className="bg-background shadow-sm">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {getGreeting()}, {user?.name?.split(" ")[0] ?? "User"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowCreateForm(true)}
              className="gap-1.5 rounded-full bg-foreground px-5 text-background hover:bg-foreground/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Add expense
            </Button>
            {/* <ThemeToggle /> */}
          </div>
        </CardContent>
      </Card>

      {/* calling differnt pages in here */}
      <div className="pb-5">
        <TransactionForm
          open={showCreateForm || !!editingTransaction}
          onOpenChange={handleFormClose}
          Transaction={editingTransaction}
        />
      </div>
      <SearchTransaction onSearch={setSearchTerm} />
      <TransactionTabs searchQuery={searchTerm}/>
    </div>
  );
};

export default Transaction;
