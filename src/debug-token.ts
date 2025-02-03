import dotenv from "dotenv";
dotenv.config();

import { generateToken } from "./utils/auth-utils";

const testToken = generateToken("1"); // Try a valid user ID
console.log("Generated Token:", testToken);