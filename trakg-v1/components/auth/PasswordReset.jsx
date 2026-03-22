"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import { PasswordInput } from "./passwordInput";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"

export function PasswordReset({ className, ...props }) {

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handlePasswordReset = async (e) => {
		e.preventDefault();

		if (!password || !confirmPassword) {
			toast.warning("Both fields are required", { richColors: true });
			return;
		}

		if (password !== confirmPassword) {
			toast.warning("Passwords do not match", { richColors: true });
			return;
		}

		if (password.length < 6) {
			toast.warning("Password must be at least 6 characters", {
				richColors: true,
			});
			return;
		}

		const resetKey = sessionStorage.getItem("resetKey");
		if (!resetKey) {
			toast.error("Session expired. Please request a new OTP.", {
				richColors: true,
			});
			return;
		}

		setIsLoading(true);

		try {
			const res = await fetch("/api/account/reset-password/change-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${resetKey}`,
				},
				body: JSON.stringify({ password: password }),
			});

			const data = await res.json();

			if (data.success) {
				toast.success("Password reset successfully!", { richColors: true });
				sessionStorage.removeItem("resetKey");
				setTimeout(() => router.push("/auth/sign-in"), 2000);
			} else {
				toast.error(data.message || "Reset failed", { richColors: true });
			}
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong", { richColors: true });
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className='overflow-hidden'>
				<CardContent className='relative'>
					<form className='p-5 md:p-5 min-w-xl' onSubmit={handlePasswordReset}>
						<div className='flex flex-col gap-6'>
							<div className='flex flex-col items-center text-center'>
								<Image
									src='/assets/logo.webp'
									width={48}
									height={48}
									alt='Trakg'
									className='rounded-xl mb-2'
								/>
								<h1 className='text-lg font-bold min-w-lg'>
									Create a new password
								</h1>
							</div>

							<div className='grid  gap-2'>
								<Label htmlFor='password'>New Password</Label>
								<PasswordInput
									key={1}
									id='password'
									name='password'
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className={"w-full min-w-72"}
									placeholder='Enter new Password'
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='cpassword'>
									Confirm Password
								</Label>
								<PasswordInput
									key={2}
									id='cpassword'
									name='cpassword'
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									placeholder='Confirm Password'
								/>
							</div>


							<Button type='submit' className='w-full' disabled={isLoading}>
								{isLoading ? "Resetting..." : "Reset Password"}
							</Button>


						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);

}
