import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/Lib/Store/AuthStore";

const GuestRoute = () => {
  const { token } = useAuthStore();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;