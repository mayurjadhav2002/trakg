import jwt, {Secret, SignOptions} from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRETE_KEYS: Record<string, string> = {
	jwt: process.env.SECRET_KEY_FOR_TOKEN || "",
	access: process.env.SECRET_KEY_FOR_ACCESS_KEY || "",
	refresh: process.env.SECRET_KEY_FOR_REFRESH_TOKEN || "",
};

["jwt", "access", "refresh"].forEach((key) => {
	if (!SECRETE_KEYS[key]) {
		console.warn(`⚠️ Warning: Missing JWT secret for type "${key}".`);
	}
});
export const createJwtToken = (
	payload: string | object | Buffer,
	type: "jwt" | "access" | "refresh",
	expiresIn: number | any | undefined
): string => {
	const secret: Secret = SECRETE_KEYS[type];
	if (!secret) {
		throw new Error(`JWT secret for type "${type}" is not defined`);
	}

	const options: SignOptions = {expiresIn};

	return jwt.sign(payload, secret, options);
};

export const verifyJwtToken = (
	token: string,
	type: "access" | "refresh" | "jwt"
) => {
	const secret = SECRETE_KEYS[type];
	if (!secret) {
		throw new Error(`JWT secret for type "${type}" is not defined`);
	}
	return jwt.verify(token, secret);
};
