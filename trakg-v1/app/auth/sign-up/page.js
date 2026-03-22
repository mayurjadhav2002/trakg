import { Suspense } from "react";
import SuspenseLoader from "@/components/loading/SuspenseLoader";
import { Register } from "@/components/auth/register-form";

export const metadata = {
  title: "Create Your Account | Trakg",
  description:
    "Join Trakg to start tracking and growing your digital presence. Sign up now to access powerful insights and tools.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <Register />
      </div>
    </Suspense>
  );
}
