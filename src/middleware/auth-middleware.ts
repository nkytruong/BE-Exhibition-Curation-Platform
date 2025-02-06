import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth-utils";

declare global {
  namespace Express {
    interface Request {
      user?: { user_id: string };
    }
  }
}

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.authToken;

  if (!token) {
    res.status(401).json({ msg: "No token provided" });
    return;
  }
  try {
    const decoded = verifyToken(token);
    req.user = { user_id: decoded.user_id };
    next();
  } catch (err) {
    res.status(403).send({ msg: "Invalid or expired token" });
  }
}
