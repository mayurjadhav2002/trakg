import {Router} from "express";
import bodyParser from "body-parser";

export const router = Router().use(bodyParser.json());
