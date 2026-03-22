import { EmailVerification } from "@/components/auth/EmailVerification";
import { PasswordReset } from "@/components/auth/PasswordReset";
import React, { act } from "react";

const ReturnComponent = (action) => {
    switch (action) {
        case 'account-verification':
            return <EmailVerification/>;
        case 'reset-password':
            return <PasswordReset/>;
        case 'email-verification':
            return <EmailVerification/>;
        default:
            return <div>Page not found</div>;
    }
}

async function page({params}) {
	const {action} = await params;
	return ReturnComponent(action);
}

export default page;
