export const authLinks = {
	google: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/google`,
	linkedin: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/linkedin`,
};

export function isValidEmail(email) {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailPattern.test(email);
}

export const pricingPlans = {
	plans: [
		{
			name: "Base",
			monthlyPrice: 49,
			annualPrice: 39,
			montlyPaymentID: "pdt_QGar3HgKktg1iynDnL31X",
			annualPaymentID: "pdt_z3a9riD3Aa0UqR8JebDTH",
			monthlyName: "Base/Monthly",
			annualName: "Base/Annual",
			websites: 1,
			customDomains: false,
			externalFormTracking: false,
			features: {
				unlimitedForms: true,
				unlimitedLeads: true,
				automations: 5,
				aiFeatures: false,
				advancedAnalytics: false,
			},
			security: {
				gdprCompliance: true,
				dataEncryption: true,
				auditLogs: true,
				accessControl: true,
			},
			support: {
				email: true,
				chat: true,
				priority: true,
				technical: true,
			},
			featureInfo: {
				websites: "Number of websites you can connect to the service.",
				customDomains:
					"Use your own custom domain instead of a default one.",
				externalFormTracking:
					"Track forms from external platforms like Google Forms.",
				unlimitedForms:
					"Create and manage an unlimited number of forms.",
				unlimitedLeads:
					"Store and access all captured leads without a limit.",
				automations:
					"Automate actions like sending emails, tagging users, etc.",
				aiFeatures:
					"Use AI-based tools for lead insights or auto-responses.",
				advancedAnalytics:
					"In-depth reporting on user behavior and form performance.",
				gdprCompliance:
					"Ensure data collection meets GDPR regulations.",
				dataEncryption:
					"All your data is stored with high-level encryption.",
				auditLogs: "Track all user actions within the platform.",
				accessControl: "Role-based access for team members.",
				email: "Reach out to support via email.",
				chat: "Live chat with our support team.",
				priority: "Faster response time for critical queries.",
				technical:
					"Support from technical experts for integration/debugging.",
			},
		},
		{
			name: "Pro",
			monthlyPrice: 149,
			annualPrice: 119,
			montlyPaymentID: "pdt_SqeYoRyW33S8S4vIas73C",
			annualPaymentID: "pdt_Vjq2T2fYzCTOQgxlr7Crg",
			monthlyName: "Pro/Monthly",
			annualName: "Pro/Annual",
			websites: 5,
			customDomains: true,
			externalFormTracking: true,
			features: {
				unlimitedForms: true,
				unlimitedLeads: true,
				automations: 20,
				aiFeatures: true,
				advancedAnalytics: true,
			},
			security: {
				gdprCompliance: true,
				dataEncryption: true,
				auditLogs: true,
				accessControl: true,
			},
			support: {
				email: true,
				chat: true,
				priority: true,
				technical: true,
			},
			featureInfo: {
				websites: "Number of websites you can connect to the service.",
				customDomains:
					"Use your own custom domain instead of a default one.",
				externalFormTracking:
					"Track forms from external platforms like Google Forms.",
				unlimitedForms:
					"Create and manage an unlimited number of forms.",
				unlimitedLeads:
					"Store and access all captured leads without a limit.",
				automations:
					"Automate actions like sending emails, tagging users, etc.",
				aiFeatures:
					"Use AI-based tools for lead insights or auto-responses.",
				advancedAnalytics:
					"In-depth reporting on user behavior and form performance.",
				gdprCompliance:
					"Ensure data collection meets GDPR regulations.",
				dataEncryption:
					"All your data is stored with high-level encryption.",
				auditLogs: "Track all user actions within the platform.",
				accessControl: "Role-based access for team members.",
				email: "Reach out to support via email.",
				chat: "Live chat with our support team.",
				priority: "Faster response time for critical queries.",
				technical:
					"Support from technical experts for integration/debugging.",
			},
		},
		{
			name: "Business",
			monthlyPrice: 249,
			annualPrice: 199,
			montlyPaymentID: "pdt_lr9lfEhGLtmmE3qit0MaA",
			annualPaymentID: "pdt_2RaVFWhIBLV9YhQWkxIZc",
			monthlyName: "Business/Monthly",
			annualName: "Business/Annual",
			websites: 20,
			customDomains: true,
			externalFormTracking: 10,
			features: {
				unlimitedForms: true,
				unlimitedLeads: true,
				automations: 100,
				aiFeatures: true,
				advancedAnalytics: true,
			},
			security: {
				gdprCompliance: true,
				dataEncryption: true,
				auditLogs: true,
				accessControl: true,
			},
			support: {
				email: true,
				chat: true,
				priority: true,
				technical: true,
			},
			featureInfo: {
				websites: "Number of websites you can connect to the service.",
				customDomains:
					"Use your own custom domain instead of a default one.",
				externalFormTracking:
					"Track forms from external platforms like Google Forms.",
				unlimitedForms:
					"Create and manage an unlimited number of forms.",
				unlimitedLeads:
					"Store and access all captured leads without a limit.",
				automations:
					"Automate actions like sending emails, tagging users, etc.",
				aiFeatures:
					"Use AI-based tools for lead insights or auto-responses.",
				advancedAnalytics:
					"In-depth reporting on user behavior and form performance.",
				gdprCompliance:
					"Ensure data collection meets GDPR regulations.",
				dataEncryption:
					"All your data is stored with high-level encryption.",
				auditLogs: "Track all user actions within the platform.",
				accessControl: "Role-based access for team members.",
				email: "Reach out to support via email.",
				chat: "Live chat with our support team.",
				priority: "Faster response time for critical queries.",
				technical:
					"Support from technical experts for integration/debugging.",
			},
		},
	],
};

export const subscriptionLink = ({productid, metadata, email}) => {
	if (process.env.NODE_ENV === "development") {
		return `https://test.checkout.dodopayments.com/buy/${productid}?quantity=1&redirect_url=${process.env.NEXT_PUBLIC_BASE_URL}&email=${email}&${metadata}`;
	}
	return `https://checkout.dodopayments.com/buy/${productid}?quantity=1&redirect_url=${process.env.NEXT_PUBLIC_BASE_URL}&email=${email}&${metadata}`; // Replace with your actual redirect URL
};

export const BackendRoute = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_VERSION}`;

export const SolitairePages = [
	"Dashboard",
	"Website > New",
	"Settings > General",
	"Settings > Billing",
	"Settings > Help",
	"Settings",
	"External Forms",
	"Externalforms",
	"Notifications"
];
