"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ErrorMessages } from "@/lib/ErrorMessages";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { Linkedin } from "lucide-react";

import { useUser } from "@/hooks/useUser";

import { useSessionInfo } from "@/hooks/useSessionInfo";
import { Eye, EyeOff } from "lucide-react";
import { usePathname } from "next/navigation";
import SuspenseLoader from "../loading/SuspenseLoader";
import { supabase } from "@/lib/supabase";
import { BackendRoute } from "@/stores/constants";

export default function LoginForm({ className, ...props }) {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionInfo = useSessionInfo();
  const { setUser } = useUser();
  const hasShownErrorRef = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    if (hasShownErrorRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const errorMsg = params.get("err") || params.get("errorMsg");

    if (errorMsg) {
      toast.error(
        ErrorMessages[errorMsg] || "An error occurred. Please try again",
        { richColors: true },
      );
      hasShownErrorRef.current = true;
    }
  }, [pathname, searchParams?.toString()]);

  const handleSocialClick = async (social) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: social,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Logged in");

      router.replace("/dashboard");
    } catch (err) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden">
          <CardContent className="relative">
            <form className="p-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <Image
                    src="/assets/logo.webp"
                    width={48}
                    height={48}
                    alt="Trakg"
                    className="rounded-xl mb-2"
                  />
                  <h1 className="text-lg font-bold">Sign in </h1>
                  {/* <p className="text-sm text-muted-foreground">
										Welcome back! Please sign in to continue.
									</p> */}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="hannah@disney.com"
                    onChange={handleChange}
                    value={loginForm.email}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/verify/account-verification"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      placeholder="********"
                      type={showPassword ? "text" : "password"}
                      onChange={handleChange}
                      value={loginForm.password}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>

                {/* Social buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialClick("google")}
                    className="w-full  shadow-sm text-sm rounded-lg py-1 bg-white border-2 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow"
                  >
                    <div className="bg-white p-2 rounded-full">
                      {/* Google SVG */}
                      <svg className="w-4" viewBox="0 0 533.5 544.3">
                        <path
                          d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                          fill="#4285f4"
                        />
                        <path
                          d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                          fill="#34a853"
                        />
                        <path
                          d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                          fill="#fbbc04"
                        />
                        <path
                          d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                          fill="#ea4335"
                        />
                      </svg>
                    </div>
                    <span className="ml-1">Sign in with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialClick("linkedin_oidc")}
                    className="w-full font-semibold shadow-sm text-sm rounded-lg py-1 bg-[#2466a8] border-2 border-blue-800 text-white flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow"
                  >
                    <div className="p-2 rounded-full">
                      <Linkedin className="w-4" />
                    </div>
                    <span className="ml-1">Sign In with LinkedIn</span>
                  </button>
                </div>

                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="cursor-pointer text-blue-600 underline underline-offset-4"
                  >
                    Create New Account
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <Link
            href="https://trakg.com/terms-and-conditions?ref=app.trakg.com"
            target="_blank"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="https://trakg.com/privacy-policy?ref=app.trakg.com"
            target="_blank"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </Suspense>
  );
}
