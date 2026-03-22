import {RabbitIcon} from "lucide-react";
import {toast} from "sonner";

export const ErrorMessages = {
	account_create_u_exists_err: "An account with this email already exists",
	login_password_incorrect_err: "Incorrect password, please try again",
	login_user_not_found_err: "User with this email not found",
	validation_error: "Please fill in all fields",
	EMAIL_NOT_VALID: "Please Enter a valid email",
	OTP_Request_Failed: "Error in sending OTP to your email",
	INTERNAL_SERVER_ERROR: "Unable to process your request",
	web_exists_err: "Website already exists",
	web_create_err: "Cannot create website",
	auth_err_token_malformed: "Your Session has expired, please login again",
	auth_err_token_invalid: "Your Session has expired, please login again",
	auth_err_token_expired: "Your Session has expired, please login again",
	auth_err_token_not_found: "Your Session has expired, please login again",
	auth_err_token_not_active: "Your Session has expired, please login again",
	leads_not_found_err: "No Leads Exists for this form",
	missing_token_or_session:
		"Failed to Authenticate with OAuth provider, please try again.",
	subscription_not_found: "No active subscription found",
	website_unreachable:
		"Website is unreachable, please check your website URL",
	"User_Oauth2.0_login_err":
		"Seems this account is already linked with OAuth, Try logging in with Google/Linkedin",
	user_not_found: "User with This Email Address dont exists",
	wrong_otp: "Incorrect OTP, please check again.",
	lead_delete_err:
		"Something went wrong while deleting the lead. Please try again.",
	lead_not_found_err: "The lead you're trying to delete doesn't exist.",
	unauthorized_err: "You are not authorized to delete this lead.",
	form_id_or_user_missing: "Form ID or user is missing.",
	form_not_exists: "The form does not exist or is inactive.",
	form_unauthorized: "You do not have access to this form.",
	internal_server_error: "Something went wrong on the server.",
	unknown_error: "An unexpected error occurred.",
};

export const InternalServerError = ({pathname}) => {
	return toast.error("It's not you, it's us. ", {
		richColors: true,
		icon: <RabbitIcon className='mr-3' />,
		description: "Please Report this here We'll fix it soon",
		action: {
			label: "Report",
			onClick: () => {
				window.open(`/support/report?pathname=${pathname}`, "_blank");
			},
		},
	});
};
