import React, { useEffect, useMemo } from "react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { useStore } from "@/stores/userStore";
countries.registerLocale(enLocale);

const getCountryOptions = () => {
	const countryObj = countries.getNames("en", { select: "official" });
	return Object.entries(countryObj).map(([code, name]) => ({
		value: code,
		label: `${getFlagEmoji(code)} ${name}`,
	}));
};

const getFlagEmoji = (countryCode) =>
	countryCode
		.toUpperCase()
		.replace(/./g, (char) =>
			String.fromCodePoint(char.charCodeAt(0) + 127397)
		);

const addressSchema = z.object({
	addressLine1: z.string().min(5, "Address must be at least 5 characters"),
	country: z.object({
		value: z.string(),
		label: z.string(),
	}, { required_error: "Country is required" }),
	state: z.string().min(2, "State is required"),
	city: z.string().min(2, "City is required"),
	pincode: z.string().min(4, "Pincode must be at least 4 digits"),
});


export default function GetAddressInfo({ setModelActive, plan, getPlanLink }) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,

	} = useForm({
		resolver: zodResolver(addressSchema),
	});

	const countryOptions = useMemo(() => getCountryOptions(), []);
	const getCountryOption = (countryName) =>
		countryOptions.find((option) => option.label.includes(countryName)) || null;


	const { user } = useUser();
	const { setUpdateUserDetails } = useStore();
	useEffect(() => {
		if (user && user.addressInfo) {
			reset({
				addressLine1: user.addressInfo.address || "",
				country: getCountryOption(user.addressInfo.country || ""),
				state: user.addressInfo.state || "",
				city: user.addressInfo.city || "",
				pincode: user.addressInfo.zipCode || "",
			});
		}
	}, [user, countryOptions, reset]);

	const onSubmit = async (data) => {
		try {
			const response = await fetch("/api/account/profile/update-user-data", {
				method: "PUT",

				body: JSON.stringify({
					data: {
						addressLine1: data.addressLine1,
						country: data.country.value,
						state: data.state,
						city: data.city,
						pincode: data.pincode,
					},
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				console.error("Server error:", result);
				toast.error("Failed to update address.", { richColors: true });
				return alert(result.message || "Something went wrong updating your address.");
			}

			toast.success("Address updated successfully.", { richColors: true });
			setUpdateUserDetails({
				addressInfo: {
					address: data.addressLine1,
					country: data.country.label,
					state: data.state,
					city: data.city,
					zipCode: data.pincode,
				}
			})
			setModelActive(false);
			if (plan && getPlanLink) {
				getPlanLink(plan);
			}


		} catch (error) {
			console.error("Network error:", error);
			toast.error("Failed to connect to the server. Please try again later.", { richColors: true });
			alert("Failed to connect to the server. Please try again later.");
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-x-hidden overflow-y-auto max-h-full bg-white/10 backdrop-blur-sm backdrop-saturate-50">
			<div className="relative w-full max-w-2xl p-4 max-h-full">
				<div className="relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
					<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Address Info</h2>
						<button
							onClick={() => setModelActive(false)}
							className="w-8 h-8 text-gray-500 hover:text-gray-900 dark:hover:text-white"
						>
							✕
						</button>
					</div>

					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="p-4 space-y-4">
							{/* Address Line 1 */}
							<div>
								<Label htmlFor="addressLine1">Address Line 1</Label>
								<Input
									id="addressLine1"
									{...register("addressLine1")}
									placeholder="123 Main St"
									className="mt-1"
								/>
								{errors.addressLine1 && (
									<p className="text-sm text-red-500 mt-1">
										{errors.addressLine1.message}
									</p>
								)}
							</div>

							{/* Country Selector */}
							<div>
								<Label htmlFor="country">Country</Label>
								<Controller
									name="country"
									control={control}
									render={({ field }) => (
										<Select
											{...field}
											options={countryOptions}
											placeholder="Select a country"
											className="mt-1"
										/>
									)}
								/>
								{errors.country && (
									<p className="text-sm text-red-500 mt-1">
										{errors.country.message}
									</p>
								)}
							</div>

							{/* State */}
							<div>
								<Label htmlFor="state">State</Label>
								<Input
									id="state"
									{...register("state")}
									placeholder="Maharashtra"
									className="mt-1"
								/>
								{errors.state && (
									<p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
								)}
							</div>

							{/* City */}
							<div>
								<Label htmlFor="city">City</Label>
								<Input
									id="city"
									{...register("city")}
									placeholder="Mumbai"
									className="mt-1"
								/>
								{errors.city && (
									<p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
								)}
							</div>

							{/* Pincode */}
							<div>
								<Label htmlFor="pincode">Pincode</Label>
								<Input
									id="pincode"
									{...register("pincode")}
									placeholder="400001"
									className="mt-1"
								/>
								{errors.pincode && (
									<p className="text-sm text-red-500 mt-1">{errors.pincode.message}</p>
								)}
							</div>
						</div>

						<div className="flex justify-between gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
							<span className="text-sm capitalize">
								this information needed for the payment
							</span>
							<button
								type="submit"
								className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm"
							>
								Submit
							</button>

						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
