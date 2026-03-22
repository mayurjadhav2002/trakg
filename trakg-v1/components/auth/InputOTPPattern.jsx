"use client";
import {REGEXP_ONLY_DIGITS_AND_CHARS} from "input-otp";

import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

export default function InputOTPPattern({className, otp, setOtp, ...props}) {
	
	return (
		<div className={cn("flex flex-col items-center gap-4", className)}>
			<InputOTP
				value={otp}
				onChange={setOtp}
				maxLength={6}
				pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
				{...props}
			>
				<InputOTPGroup>
					{Array.from({length: 6}).map((_, index) => (
						<InputOTPSlot key={index} index={index} />
					))}
				</InputOTPGroup>
			</InputOTP>

		</div>
	);
}
