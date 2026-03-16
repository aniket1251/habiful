import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function getPrivateKey(): string {
  return (process.env.JWT_PRIVATE_KEY || "").replace(/\\n/g, "\n");
}

function getPublicKey(): string {
  return (process.env.JWT_PUBLIC_KEY || "").replace(/\\n/g, "\n");
}

function getAccessTokenExpiry(): string {
  return process.env.ACCESS_TOKEN_EXPIRY || "15m";
}

function getRefreshTokenExpiry(): string {
  return process.env.REFRESH_TOKEN_EXPIRY || "7d";
}

export function validateKeys(): void {
  const priv = getPrivateKey();
  const pub = getPublicKey();
  if (!priv || priv.trim() === "") {
    console.error("FATAL: JWT_PRIVATE_KEY environment variable is required");
    process.exit(1);
  }
  if (!pub || pub.trim() === "") {
    console.error("FATAL: JWT_PUBLIC_KEY environment variable is required");
    process.exit(1);
  }
}

export function generateAccessToken(user: {
  id: number;
  role: string;
  email: string;
}): string {
  return jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    getPrivateKey() as Secret,
    { algorithm: "RS256", expiresIn: getAccessTokenExpiry() } as SignOptions
  );
}

export function generateRefreshToken(user: {
  id: number;
  role: string;
  email: string;
}): string {
  return jwt.sign(
    { userId: user.id, role: user.role, tokenType: "refresh" },
    getPrivateKey() as Secret,
    { algorithm: "RS256", expiresIn: getRefreshTokenExpiry() } as SignOptions
  );
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getPublicKey(), {
    algorithms: ["RS256"],
  }) as JwtPayload;
}
