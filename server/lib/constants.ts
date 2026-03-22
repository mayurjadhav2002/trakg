export const PlanDetails: Record<string, string> = {
	"Base/Monthly": "pdt_QGar3HgKktg1iynDnL31X",
	"Base/Annual": "pdt_z3a9riD3Aa0UqR8JebDTH",
	"Pro/Monthly": "pdt_SqeYoRyW33S8S4vIas73C",
	"Pro/Annual": "pdt_Vjq2T2fYzCTOQgxlr7Crg",
	"Business/Monthly": "pdt_lr9lfEhGLtmmE3qit0MaA",
	"Business/Annual": "pdt_2RaVFWhIBLV9YhQWkxIZc",
};

export const PlanAuthorizationDetails: Record<string, any> = {
	Free: {
		Website: 1,
		customDomains: 0,
		automations: 5,
		externalFormTracking: 0,
		aiFeatures: false,
		advancedAnalytics: false,
	},
	Base: {
		Website: 1,
		customDomains: 0,
		automations: 5,
		externalFormTracking: 0,
		aiFeatures: false,
		advancedAnalytics: false,
	},
	Pro: {
		Website: 5,
		customDomains: true,
		automations: 20,
		externalFormTracking: true,
		aiFeatures: true,
		advancedAnalytics: false,
	},
	Business: {
		Website: 20,
		customDomains: true,
		automations: 100,
		externalFormTracking: true,
		aiFeatures: true,
		advancedAnalytics: true,
	},
};

export const PlanAuthorization: Record<string, any> = {
	pdt_d0AynBmoHKXxASQTasAyH: PlanAuthorizationDetails.Base,
	pdt_4T0OfLYV0P2t0BrwBXq6R: PlanAuthorizationDetails.Base,
	pdt_gVHUdQX5c8jobUvFGJHvZ: PlanAuthorizationDetails.Pro,
	pdt_1bFToYb1BZSs4NCodaUuA: PlanAuthorizationDetails.Pro,
	pdt_MAyDnXt6OxefRxerKIwO9: PlanAuthorizationDetails.Business,
	pdt_fSpikFZn0cyZaHEqExf0j: PlanAuthorizationDetails.Business,
	FREE_TRIAL: PlanAuthorizationDetails.Business,
	FREE: PlanAuthorizationDetails.Free,
};

export const TRIAL_PERIOD = 30;
