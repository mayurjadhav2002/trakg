import nodemailer, {SendMailOptions} from "nodemailer";
import {EmailOptions} from "../types/global";

const smtpHost = process.env.MAIL_HOST;
const smtpPort = Number(process.env.MAIL_PORT) || 587;
const smtpUser = process.env.MAIL_EMAIL;
const smtpPass = process.env.MAIL_PASSWORD;

if (!smtpHost || !smtpUser || !smtpPass) {
	console.error(
		"SMTP configuration is missing. Please check your environment variables."
	);
	// Don’t throw here in production – just disable emails
}

const transporter = nodemailer.createTransport({
	host: smtpHost,
	port: smtpPort,
	secure: smtpPort === 465,
	auth: {
		user: smtpUser,
		pass: smtpPass,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

export const sendEmail = async ({
	to,
	subject,
	html,
	text,
	from,
	cc,
	bcc,
	replyTo,
	attachments,
}: EmailOptions) => {
	if (!to || (Array.isArray(to) && to.length === 0)) {
		console.error("[Email Failure] → No recipients provided");
		return false;
	}

	const mailOptions: SendMailOptions = {
		from: from || `support@trakg.com`,
		to,
		subject,
		html,
		text,
		cc,
		bcc,
		replyTo,
		attachments,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.info(`[Email Success] → ${to} (${info.messageId})`);
		return info;
	} catch (error: any) {
		console.error(`[Email Failure] → ${to}:`, error.message);
		return false; // Do not throw
	}
};
