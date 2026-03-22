const { cookies } = require("next/headers");

const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;
const session = cookieStore.get("session")?.value;

export const cookieHeader = `token=${token}; session=${session}`;
