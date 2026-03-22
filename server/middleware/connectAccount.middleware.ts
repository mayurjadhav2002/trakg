import {verifyJwtToken} from "../lib/crypt/jwtTokens";
import {Request, Response, NextFunction} from "express";
import {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";

export const ConnectMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	try {
		const token = req.query.authorization as string;

		if (!token) {
			return res.status(401).json({
				message: "Token Not Found",
				status: "Failed",
				errorCode: "auth_err_token_not_found",
			});
		}

		let payload: string | object | undefined;
		try {
			payload = await verifyJwtToken(token, "access");
		} catch (err) {
			if (err instanceof JsonWebTokenError) {
				return res
					.status(401)
					.redirect(process.env.FRONTEND_URL || "app.trakg.com");
			}
			if (err instanceof TokenExpiredError) {
				return res
					.status(401)
					.redirect(process.env.FRONTEND_URL || "app.trakg.com");
			}
			throw err;
		}

		if (!payload) {
			return res
				.status(401)
				.redirect(process.env.FRONTEND_URL || "app.trakg.com");
		}

		req.body.user = payload;
		next();
	} catch (error) {
		console.error("AuthMiddleware error:", error);
		return res.status(500).json({
			message: "Internal Server Error",
			status: "Failed",
			errorCode: "internal_server_err",
		});
	}
};
