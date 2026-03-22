"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Linkedin, Router } from "lucide-react";
import Link from "next/link";
import { PasswordInput } from "./passwordInput";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorMessages } from "@/lib/ErrorMessages";
import { useFetch } from "@/hooks/useFetch";
import { useSearchParams } from "@/node_modules/next/navigation";
import { authLinks, BackendRoute } from "@/stores/constants";
import { Loader2 } from "lucide-react";
import { useSessionInfo } from "@/hooks/useSessionInfo";
import SuspenseLoader from "../loading/SuspenseLoader";
import { supabase } from "@/lib/supabase";

export function Register({ className, ...props }) {
  const router = useRouter();
  const { setUser } = useUser();
  const searchParams = useSearchParams();
  const sessionInfo = useSessionInfo();

  const [userData, setUserData] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errorMsg = searchParams.get("errorMsg");
    const err = searchParams.get("err");

    if (errorMsg || err) {
      toast.error(
        ErrorMessages[errorMsg] ||
          ErrorMessages[err] ||
          "An error occurred. Please try again",
        { richColors: true },
      );
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = userData.name.trim();
    const company = userData.company.trim();
    const email = userData.email.trim();
    const password = userData.password;

    if (!name || !company || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create Supabase account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            company,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // If email confirmation required
      if (!data.session) {
        toast.success("Check your email to confirm your account");
        router.replace("/auth/sign-in");
        return;
      }

      const token = data.session.access_token;

      // 2️⃣ Sync user with backend
      await fetch(`${BackendRoute}/auth/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 3️⃣ Fetch full user profile
      const res = await fetch(`${BackendRoute}/account/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const result = await res.json();

      // 4️⃣ Save user in Zustand
      setUser(result.user);

      toast.success("Account created successfully");

      // 5️⃣ Redirect
      router.replace("/dashboard?d=welcome");
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`${provider} SignIn error:`, error);

      toast.error(
        `Failed to sign in with ${
          provider.charAt(0).toUpperCase() + provider.slice(1)
        }. Please try again.`,
        { richColors: true },
      );
    }
  };

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden">
          <CardContent className="relative">
            <form className="p-5 md:p-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <Image
                    src="/assets/logo.webp"
                    width={48}
                    height={48}
                    alt="Trakg"
                    className="rounded-xl mb-2"
                  />
                  <h1 className="text-lg font-bold">Sign up</h1>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      onChange={handleChange}
                      placeholder="Hannah Montana"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      type="text"
                      onChange={handleChange}
                      name="company"
                      placeholder="Disney"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="hannah@disney.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <PasswordInput
                    id="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="********"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full disabled:cursor-not-allowed cursor-pointer"
                  disabled={
                    !userData.name ||
                    !userData.company ||
                    !userData.email ||
                    !userData.password
                  }
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
                <div className="relative  text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialSignIn("google")}
                    className="w-full  col-span-2 shadow-sm text-sm rounded-lg py-1 bg-white border-2 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow"
                  >
                    <div className="bg-white p-2 rounded-full">
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
                    <span className="ml-1">Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialSignIn("linkedin_oidc")}
                    className="w-full font-semibold shadow-sm  text-sm
                rounded-lg py-0.5 bg-[#2466a8] border-2 border-blue-800 text-white flex 
                items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                  >
                    <div className=" p-1 rounded-full">
                      <Linkedin className="w-4" />
                    </div>
                    <span className="ml-1">LinkedIn</span>
                  </button>
                </div>
                <div className="text-center text-sm">
                  Already have an Account?{" "}
                  <Link
                    href="/auth/sign-in"
                    className="cursor-pointer text-blue-600 underline underline-offset-4"
                  >
                    Click to Login
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By creating account, you agree to our{" "}
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
