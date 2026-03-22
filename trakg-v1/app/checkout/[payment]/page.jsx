"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { DotLottieReact as Player } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import "@/style/billing.min.css";
import SuspenseLoader from "@/components/loading/SuspenseLoader";

// 🌀 Animation Wrapper
const Lottie = ({ src, height, width, loop = false }) => (
  <Player autoplay loop={loop} src={src} style={{ height, width }} />
);

// 🔁 Loader Component
const VerifyingLoader = () => (
  <div className="flex flex-col items-center justify-center mt-32 text-center w-full max-w-xl">
    <Lottie src="/assets/lottie/loading_lottie_blue.json" height={200} width={200} loop />
  </div>
);

// ✅ Success Component
const SuccessMessage = ({ countdown }) => (
  <div className="flex flex-col items-center text-center max-w-xl w-full">
    <Lottie src="/assets/lottie/payment_success.json" height={500} width={500} />
    <h2 className="text-green-600 text-3xl font-bold -mt-20">Subscription Verified!</h2>
    <p className="text-gray-600 mt-2">
      You're all set. Enjoy the power of never missing an abandoned client.
    </p>
    <p className="text-sm text-gray-500 mt-4">Redirecting in {countdown}...</p>
  </div>
);

// 🔁 Renewal Component
const RenewalMessage = () => (
  <div className="flex flex-col items-center text-center max-w-xl w-full">
    <Lottie src="/assets/lottie/payment_renewal.json" height={480} width={480} />
    <h2 className="text-yellow-500 text-[28px] font-semibold -mt-24">Renewal Required</h2>
    <p className="text-gray-600 mt-2">Your plan needs renewal to continue.</p>
  </div>
);

// ❌ Inactive Component
const InactiveMessage = () => (
  <div className="flex flex-col items-center text-center max-w-xl w-full">
    <Lottie src="/assets/lottie/payment_failure.json" height={460} width={460} />
    <h2 className="text-red-600 text-[26px] font-bold -mt-24">Account Inactive</h2>
    <p className="text-gray-600 mt-2">Please subscribe to regain access.</p>
  </div>
);

// ⚠️ Error Component
const ErrorMessage = ({ message }) => (
  <div className="flex flex-col items-center text-center max-w-xl w-full">
    <Lottie src="/assets/lottie/server_failure.json" height={450} width={450} />
    <h2 className="text-red-600 text-[28px] font-semibold -mt-20">Error Occurred</h2>
    <p className="text-gray-600 mt-2">{message}</p>
  </div>
);

export default function PaymentVerificationPage() {
  const router = useRouter();
  const { user } = useUser();
  const searchParams = useSearchParams();

  const [messageType, setMessageType] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(5);
  const countdownStarted = useRef(false);

  const subscriptionID = searchParams.get("subscription_id");
  const paymentStatus = searchParams.get("status");

  useEffect(() => {
    const verifySubscription = async () => {
      if (!user?.id || !user?.email) return;

      try {
        const params = new URLSearchParams({
          userId: user.id,
          email: user.email,
        });
        if (subscriptionID) params.append("subscriptionID", subscriptionID);
        if (paymentStatus) params.append("paymentStatus", paymentStatus);

        const res = await fetch(`/api/subscriptions/active_subscriptions?${params.toString()}`);
        if (!res.ok) {
          setMessageType("error");
          setErrorMsg("API request failed.");
          return;
        }

        const data = await res.json();
        sessionStorage.setItem("userClaims", JSON.stringify(data));

        const { subscriptionStatus } = data;
        if (subscriptionStatus?.success) {
          const isActive = subscriptionStatus.subscriptionStatus === "active";
          const hasTrial = subscriptionStatus.trialDaysRemaining > 0;
          setMessageType(isActive || hasTrial ? "success" : "renewal");
        } else {
          setMessageType("inactive");
        }
      } catch {
        setMessageType("error");
        setErrorMsg("Something went wrong during verification.");
      }
    };

    verifySubscription();
  }, [user?.id, user?.email, subscriptionID, paymentStatus]);

  // Countdown and redirect
  useEffect(() => {
    if (messageType !== "success" || countdownStarted.current) return;

    countdownStarted.current = true;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          router.push("/dashboard");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [messageType, router]);

  return (
    <Suspense fallback={<SuspenseLoader />}>

      <div className="relative min-h-screen flex justify-center px-4 bg-gray-50">
        <div className="w-full flex justify-center">
          {messageType === "success" && <SuccessMessage countdown={countdown} />}
          {messageType === "renewal" && <RenewalMessage />}
          {messageType === "inactive" && <InactiveMessage />}
          {messageType === "error" && <ErrorMessage message={errorMsg} />}
          {messageType === null && <VerifyingLoader />}
        </div>

        <div className="absolute bottom-6 w-full px-6">
          <div className="bg-gradient-to-r from-green-100 to-violet-100 text-sm p-3 rounded-md text-center text-gray-700">
            If you’ve made a payment and it’s not reflected here, please{" "}
            <Link href="/contact" className="underline font-semibold">
              contact us
            </Link>
            .
          </div>
        </div>
      </div>
    </Suspense>
  );
}
