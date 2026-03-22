import { UAParser } from "ua-parser-js";

export function toNumberSafe(v: any): number {
	if (v === null || v === undefined) return 0;
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
}

export function getDomainFromUrl(fullUrl: string): String | null {
	try {
		const parsedUrl = new URL(fullUrl);
		return parsedUrl.host;
	} catch (err) {
		console.error("Invalid URL:", err);
		return null;
	}
}

export function parseUserAgent(device: any): any {
	if (!device || !device.userAgent) {
		return {
			os: "unknown",
			browser: "unknown",
			deviceType: "unknown",
		};
	}

	const parser = new UAParser(device.userAgent);
	const result = parser.getResult();

	const osName = result.os.name || device.platform;
	const osVersion = result.os.version || "";
	const browserName = result.browser.name || "";
	const deviceModel = result.device.model || "";

	let deviceType = "desktop";
	const osLower = (osName + "").toLowerCase();

	if (osLower.includes("android")) deviceType = "android";
	else if (
		deviceModel.toLowerCase().includes("iphone") ||
		osLower.includes("ios")
	)
		deviceType = "iphone";
	else if (osLower.includes("mac")) deviceType = "mac";

	return {
		os: osVersion ? `${osName} ${osVersion}` : osName,
		browser: browserName,
		deviceType,
	};
}

export function normalizeForDb(url: string): string | null {
	try {
		if (!url) return null;

		let safe = url.trim();

		if (!/^https?:\/\//i.test(safe)) {
			safe = "https://" + safe;
		}

		const u = new URL(safe);

		if (u.hostname === "localhost") {
			return `${u.protocol}//${u.hostname}${u.port ? `:${u.port}` : ""}`;
		}

		let hostname = u.hostname.replace(/^www\./i, "");

		return `https://${hostname}`;
	} catch {
		return null;
	}
}