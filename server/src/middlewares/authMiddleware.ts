import { Request, Response, NextFunction } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { verifyToken } from "../utils/tokenUtils";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

export const authMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const decoded = verifyToken(token);

      req.user = {
        id: decoded.userId,
        role: decoded.role,
      };

      const hasAccess = allowedRoles.includes(decoded.role.toLowerCase());
      if (!hasAccess) {
        res.status(403).json({ message: "Access Denied" });
        return;
      }
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        res.status(401).json({ message: "Token expired" });
        return;
      }
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    next();
  };
};
