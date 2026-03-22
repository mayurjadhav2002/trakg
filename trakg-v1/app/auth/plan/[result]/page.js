"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useUser} from "@/hooks/useUser";

export default function PaymentVerificationPage() {
	const router = useRouter();
	const {user} = useUser();

	useEffect(() => {
		const verify = async () => {
			if (!user?.id || !user?.email) {
				router.replace("/auth/sign-in");
				return;
			}

			try {
				const res = await fetch("/api/subscriptions", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: user.id,
						email: user.email,
					}),
				});

				const data = await res.json();

				/**
				 * data response is expected to contain:
				 * - success: boolean
				 * - isAccountActive: boolean
				 * - hasActiveSubscription: boolean
				 * - hasTrial: boolean
				 */

				if (!data.success) {
					console.error("Verification failed:", data);
					router.replace("/pricing");
					return;
				}

				if (data.isAccountActive) {
					if (data.hasActiveSubscription || data.hasTrial) {
						router.replace("/dashboard");
					} else {
						// Active account, but no subscription and trial expired
						router.replace("/dashboard/settings/billing/renewal");
					}
				} else {
					// Inactive account — send to plan page
					router.replace("/pricing");
				}
			} catch (err) {
				console.error("Client-side error during verification:", err);
				router.replace("/pricing");
			}
		};

		verify();
	}, [router, user]);

	return (
		<div className='flex items-center justify-center min-h-screen'>
			<p className='text-lg text-gray-700'>
				Verifying your subscription...
			</p>
		</div>
	);
}
