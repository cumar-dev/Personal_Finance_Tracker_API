import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/Lib/store/AuthStore";

const GuestRoute = () => {
  const { token } = useAuthStore();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;