import { useStore } from "@/stores/userStore";

export const ErrorActions = async (error) => {
	const AUTH_ERRORS = [
		"auth_err_token_not_found",
		"auth_err_token_expired",
		"auth_err_token_not_active",
		"auth_err_token_invalid",
		"auth_err_token_malformed",
		"missing_token_or_session",
	];

	if (AUTH_ERRORS.includes(error?.errorCode)) {
		try {
			await fetch("/api/logout", {
				method: "GET",
				credentials: "include",
			});
		} catch (err) {
			console.error("Error clearing cookies:", err);
		}

		const { logout } = useStore.getState(); 
		logout();

		// Optional: redirect user
		setTimeout(() => {
			window.location.href = "/auth/sign-in";
		}, 2000);
	}
};
