import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Eye, EyeOff, Mail, Lock, LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Api } from "@/Lib/Api/ApiCient";
import { useAuthStore } from "@/Lib/Store/AuthStore";
import { toast } from "sonner";
const Login = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const response = await Api.post("/auth/login", data);
      console.log("login response", response);
      return response.data;
    },
    onSuccess: (data) => {
      if (!data?.token) {
        setError("Login failed");
        toast.error("log in failed too early..");
        return;
      }
      setAuth(data.user, data.token);
      navigate("/dashboard");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Something went wrong";
      setError(message);
      toast.error(message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (!formData.email.trim() || !formData.password.trim()) {
        setError("fill the fields");
        toast.error("please fill the fields");
        return;
      }
      console.log(formData);
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
      toast.success("Login successful");
    } catch (error) {
      console.error("error exist", error.message);
    }
  };
  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-muted/40 px-4 py-8">
        <div className="w-full max-w-md">
          <Card className="rounded-3xl border border-border/60 shadow-xl backdrop-blur-sm bg-card/95">
            <CardHeader className="space-y-1 pb-2">
              <h1 className="text-2xl font-semibold tracking-tight text-center">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Sign in to your account to continue tracking your finances.
              </p>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="rounded-xl pl-9 h-10"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      className="rounded-xl pl-9 pr-10 h-10"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl h-10 mt-2 font-medium"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Login account...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-0">
              <p className="text-sm text-center text-muted-foreground pt-2">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-foreground hover:underline underline-offset-4"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
