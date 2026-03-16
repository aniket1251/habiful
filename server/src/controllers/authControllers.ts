import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/tokenUtils";
import {
  validateEmail,
  validatePassword,
  validateRole,
} from "../utils/validationUtils";
import { uploadToCloudinary } from "../utils/uploadUtils";

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 10;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function setRefreshTokenCookie(res: Response, token: string): void {
  const decoded = verifyToken(token);
  const maxAge = (decoded.exp! - decoded.iat!) * 1000;

  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "strict",
    path: "/auth",
    maxAge,
  });
}

function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "strict",
    path: "/auth",
  });
}

async function storeRefreshToken(token: string, userId: number, role: string): Promise<void> {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const decoded = verifyToken(token);

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      userRole: role,
      expiresAt: new Date(decoded.exp! * 1000),
    },
  });
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      res.status(400).json({ message: emailCheck.message });
      return;
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      res.status(400).json({
        message: "Password does not meet requirements",
        errors: passwordCheck.errors,
      });
      return;
    }

    const roleCheck = validateRole(role);
    if (!roleCheck.valid) {
      res.status(400).json({ message: roleCheck.message });
      return;
    }

    const normalizedRole = role.toLowerCase();

    const existingManager = await prisma.manager.findUnique({ where: { email } });
    const existingTenant = await prisma.tenant.findUnique({ where: { email } });

    if (existingManager || existingTenant) {
      res.status(409).json({ message: "An account with this email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    let user: any;

    if (normalizedRole === "manager") {
      user = await prisma.manager.create({ data: { name, email, phoneNumber, passwordHash } });
    } else {
      user = await prisma.tenant.create({ data: { name, email, phoneNumber, passwordHash } });
    }

    // Upload profile image if provided
    if (req.file) {
      try {
        const publicId = `${normalizedRole}-${user.id}-${Date.now()}`;
        const profileImageUrl = await uploadToCloudinary(req.file.buffer, publicId, "profile-pictures");
        if (normalizedRole === "manager") {
          await prisma.manager.update({ where: { id: user.id }, data: { profileImageUrl } });
        } else {
          await prisma.tenant.update({ where: { id: user.id }, data: { profileImageUrl } });
        }
        user.profileImageUrl = profileImageUrl;
      } catch (uploadErr) {
        console.error("Profile image upload failed:", uploadErr);
        // User created successfully, just without profile image
      }
    }

    const accessToken = generateAccessToken({ id: user.id, role: normalizedRole, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, role: normalizedRole, email: user.email });

    await storeRefreshToken(refreshToken, user.id, normalizedRole);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, phoneNumber: user.phoneNumber, role: normalizedRole, profileImageUrl: user.profileImageUrl },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Something went wrong during registration. Please try again." });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    let user: any = await prisma.manager.findUnique({ where: { email } });
    let role = "manager";

    if (!user) {
      user = await prisma.tenant.findUnique({ where: { email } });
      role = "tenant";
    }

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken({ id: user.id, role, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, role, email: user.email });

    await storeRefreshToken(refreshToken, user.id, role);
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, phoneNumber: user.phoneNumber, role, profileImageUrl: user.profileImageUrl || null },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong during login. Please try again." });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      res.status(401).json({ message: "Refresh token is required" });
      return;
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      clearRefreshTokenCookie(res);
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    if (decoded.tokenType !== "refresh") {
      clearRefreshTokenCookie(res);
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const storedToken = await prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (!storedToken) {
      clearRefreshTokenCookie(res);
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const accessToken = generateAccessToken({ id: decoded.userId, role: decoded.role, email: decoded.email || "" });
    const newRefreshToken = generateRefreshToken({ id: decoded.userId, role: decoded.role, email: decoded.email || "" });

    await storeRefreshToken(newRefreshToken, decoded.userId, decoded.role);
    setRefreshTokenCookie(res, newRefreshToken);

    res.json({ accessToken });
  } catch (error: any) {
    console.error("Token refresh error:", error);
    res.status(500).json({ message: "Something went wrong. Please sign in again." });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      await prisma.refreshToken.deleteMany({ where: { tokenHash } });
    }

    clearRefreshTokenCookie(res);
    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Something went wrong during logout." });
  }
};
