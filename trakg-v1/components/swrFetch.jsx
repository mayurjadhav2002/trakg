export const fetcher = async (args) => {
	const url = args[0];
	const method = args[1] || "GET";
	const body = args[2] || null;
	const headers = args[3] || {};

	return fetch(url, {
		method,
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		body: body ? JSON.stringify(body) : undefined,
	}).then(async (res) => {
		let result;
		try {
			result = await res.json();
		} catch {
			throw new Error("Invalid JSON response from server");
		}

		if (!res.ok) {
			throw {
				message: result?.message || "Something went wrong",
				errorCode: result?.errorCode || "INTERNAL_SERVER_ERROR",
			};
		}

		return result;
	})
};
