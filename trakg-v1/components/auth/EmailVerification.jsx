"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Mail } from "lucide-react";

import InputOTPPattern from "./InputOTPPattern";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { fetcher, useFetch } from "@/hooks/useFetch";
import { redirect } from "next/navigation";
import { ErrorMessages } from "@/lib/ErrorMessages";
import { isValidEmail } from "@/stores/constants";
import Spinner from "../loading/spinner";

export function EmailVerification({ className, ...props }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState("");

  const [inputType, setInputType] = useState("email");
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };
  const RequestNewOtp = async () => {
    try {
      if (!email || !isValidEmail(email)) {
        toast.warning("Please enter the correct email!", { richColors: true });
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetcher(
        `/api/account/reset-password/request-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      // Check API response
      if (response?.status === "Failed" || !response?.success) {
        const errorMessage =
          ErrorMessages[response.errorCode] ||
          response.message ||
          "An error occurred. Please try again";

        toast.error(errorMessage, { richColors: true });
        setError(errorMessage);
        return;
      }

      toast.success("OTP sent to your email", { richColors: true });
      setInputType("otp");
      setSuccess(true);
    } catch (err) {
      console.error("RequestNewOtp error:", err);
      toast.error("An error occurred. Please try again", { richColors: true });
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      if (!otp || otp.length < 6) {
        toast.warning("Please enter a valid 6-digit OTP!", {
          richColors: true,
        });
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetcher(`/api/account/reset-password/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      // Check API response
      if (!response.success || response.status === "Failed") {
        const errorMessage =
          ErrorMessages?.[response.errorCode] ||
          response.message ||
          "An error occurred. Please try again";

        toast.error(errorMessage, { richColors: true });
        setError(errorMessage);
        return;
      }

      const resetKey = response?.data?.resetKey;
      if (!resetKey) {
        toast.error("Missing reset key. Please request a new OTP.", {
          richColors: true,
        });
        setError("Missing reset key");
        return;
      }

      try {
        sessionStorage.setItem("resetKey", resetKey);
      } catch (storageError) {
        toast.error("Unable to save key. Try Resetting again.", {
          richColors: true,
        });
        setError("Storage error");
        return;
      }

      toast.success("OTP verified successfully!", { richColors: true });
      setSuccess(true);

      setTimeout(() => {
        redirect(`/auth/verify/reset-password`);
      }, 2000);
    } catch (err) {
      console.error("verifyOTP error:", err);
      toast.error("Something went wrong. Please try again.", {
        richColors: true,
      });
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden ">
        <CardContent className="relative">
          <div className="p-5 md:p-5">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/assets/logo.webp"
                  width={48}
                  height={48}
                  alt="Trakg"
                  className="rounded-xl mb-2"
                />
                <h1 className="text-lg font-bold">Verify your Account</h1>
                <p>Enter your registed Email Below</p>
              </div>

              {inputType === "email" && (
                <>
                  <div className="grid gap-2 min-w-[450px] max-w-full">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="enter your email"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    disabled={loading}
                    onClick={RequestNewOtp}
                  >
                    {loading ? <Spinner color="white" size="sm" /> : "Send OTP"}
                  </Button>
                </>
              )}

              {inputType === "otp" && (
                <>
                  <p className="text-sm max-w-md text-muted-foreground">
                    {" "}
                    We've sent a verification code to your email address. Enter
                    the code below to confirm your identity.
                  </p>
                  <div className="grid items-start justify-start gap-3">
                    <Label htmlFor="otpInput">Enter OTP</Label>
                    <InputOTPPattern otp={otp} setOtp={setOtp} />
                  </div>

                  <Button type="button" className="w-full" onClick={verifyOTP}>
                    {loading ? <Spinner color="white" size="sm" /> : "Verify"}
                  </Button>

                  <p>
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      onClick={() => RequestNewOtp()}
                      className="bg-muted bg-white text-blue-600 font-semibold "
                    >
                      Resend
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
