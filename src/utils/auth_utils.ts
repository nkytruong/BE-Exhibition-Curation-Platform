import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
};

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};
