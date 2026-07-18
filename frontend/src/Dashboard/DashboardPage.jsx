import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/Lib/Store/AuthStore";
import { useState } from "react";
import TransactionForm from "@/Components/Transactions/TransactionForm";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const DashboardPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuthStore();
  // const initials = (user?.name ?? "U")
  //   .split(" ")
  //   .filter(Boolean)
  //   .map((n) => n[0])
  //   .join("")
  //   .slice(0, 2)
  //   .toUpperCase();

  // const today = new Date().toLocaleDateString("en-US", {
  //   weekday: "long",
  //   month: "long",
  //   day: "numeric",
  // });

  return (
    <div className="bg-muted/40">
      <Card className="bg-white shadow-sm">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {getGreeting()}, {user?.name?.split(" ")[0] ?? "User"}
            </h1>
          </div>

          <Button onClick={()=> setShowCreateForm(true)} className="gap-1.5 rounded-full bg-foreground px-5 text-background hover:bg-foreground/90">
            <Plus className="h-3.5 w-3.5" />
            Add expense
          </Button>
        </CardContent>
      </Card>

      {/* calling differnt pages in here */}
      <TransactionForm 
      open = {showCreateForm}
      onOpenChange = {setShowCreateForm}
      />
    </div>
  );
};

export default DashboardPage;
