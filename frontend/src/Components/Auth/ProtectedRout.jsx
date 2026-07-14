import { Api } from "@/Lib/Api/ApiCient";
import { useAuthStore } from "@/Lib/Store/AuthStore";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRout = ({ children }) => {
  const location = useLocation();
  const { user, token, clearAuth, setAuth} = useAuthStore();
  const { data, isError, isSuccess, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    enabled: !!token,
    retry: 1,
    queryFn: async () => {
      const response = await Api.get("/auth/profile");
      console.log("protected response", response);
      return response.data;
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      setAuth(data, token);
    }
  }, [isSuccess, data, token, setAuth]);

  useEffect(() => {
    if (isError) {
      clearAuth();
    }
  }, [error, isError, clearAuth]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    console.log("error here", isError);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    console.log("user not found", user);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRout;
