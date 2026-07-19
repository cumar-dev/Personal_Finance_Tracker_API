import RecentTransaction from "@/Components/Transactions/recentTransaction";
import TransactionList from "@/Components/Transactions/TransactionList";

const DashboardPage = () => {
 
  return (
    <>
      <div className="bg-muted/40">
        <div>
          <TransactionList />
        </div>
        <RecentTransaction />
        
      </div>
    </>
  );
};

export default DashboardPage;
