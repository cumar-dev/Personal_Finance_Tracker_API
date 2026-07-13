import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import {Link} from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
   const handleChange = (e)=> {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
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
              <form className="space-y-4">
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
                  disabled={isSubmitting}
                >
                 Sign in
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
