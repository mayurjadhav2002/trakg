import LoginForm from "@/components/auth/LoginForm";
import SuspenseLoader from "@/components/loading/SuspenseLoader";
import {Suspense} from "react";

export const metadata = {
  title: "Sign In | Trakg",
  description: "Access your Trakg dashboard to manage leads, analytics, and insights. Secure login to your Trakg account.",
};

export default function LoginPage() {
	return (
		<Suspense fallback={<SuspenseLoader />}>
			<div className='flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10'>
				<LoginForm />
			</div>
		</Suspense>
	);
}
