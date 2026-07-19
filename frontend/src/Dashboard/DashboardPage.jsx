import GetMonthlySummary from "@/Components/Transactions/GetMonthlySummary";
import RecentTransaction from "@/Components/Transactions/recentTransaction";
import TransactionList from "@/Components/Transactions/TransactionList";

const DashboardPage = () => {
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
    <>
      <div className="bg-muted/40">
        <div>
          <TransactionList />
        </div>
        <RecentTransaction />
        <GetMonthlySummary />
      </div>
    </>
  );
};

export default DashboardPage;
