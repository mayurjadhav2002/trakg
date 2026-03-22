import {v4 as uuidv4} from "uuid";
import {createHash} from "crypto";

export const generateIds = (size: number = 21) => {
	const hash = createHash("sha256").update(uuidv4()).digest("hex");
	return hash.slice(0, size);
};
