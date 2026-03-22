import { FastifyReply } from "fastify";

export const InternalServerError = (
	reply: FastifyReply,
	error: Error | string | unknown
): void => {
	console.error(error);
	reply.status(500).send({
		message: "Internal Server Error Occurred",
		errorCode: "INTERNAL_SERVER_ERROR",
		error,
	});
};

export const DataRecordingError = (
	reply: FastifyReply,
	error: Error | string
): void => {
	console.error(error);
	reply.status(500).send({
		message: "Failed to record data",
		errorCode: "DATA_RECORDING_ERROR",
	});
};