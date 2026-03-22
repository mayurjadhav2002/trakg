import {UAParser} from "ua-parser-js";
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


export function buildDateBucketsStats(
	rawData: any[],
	from: Date,
	to: Date,
	intervalDays: number
) {
	const buckets: Record<string, { partial: number; complete: number }> = {};

	for (
		let d = new Date(from);
		d <= to;
		d.setDate(d.getDate() + intervalDays)
	) {
		const dateKey = d.toISOString().split("T")[0];
		buckets[dateKey] = { partial: 0, complete: 0 };
	}

	for (const entry of rawData) {
		const created = new Date(entry.createdAt);
		let bucketDate = new Date(created);

		if (intervalDays > 1) {
			// Round down to nearest interval day
			const dayOffset = Math.floor(
				(created.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
			);
			const bucketOffset = Math.floor(dayOffset / intervalDays) * intervalDays;
			bucketDate = new Date(from);
			bucketDate.setDate(from.getDate() + bucketOffset);
		}

		const bucketKey = bucketDate.toISOString().split("T")[0];
		if (!buckets[bucketKey]) {
			buckets[bucketKey] = { partial: 0, complete: 0 };
		}
		if (entry.conversion) buckets[bucketKey].complete += entry._count;
		else buckets[bucketKey].partial += entry._count;
	}

	return Object.entries(buckets).map(([date, counts]) => ({
		date,
		...counts,
	}));
}