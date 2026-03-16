import { generateAccessToken, generateRefreshToken, verifyToken } from "../../../src/utils/tokenUtils";
import jwt from "jsonwebtoken";

const testUser = { id: 1, role: "tenant", email: "test@example.com" };

describe("Token Utils", () => {
  describe("generateAccessToken", () => {
    it("should generate a valid JWT with correct claims", () => {
      const token = generateAccessToken(testUser);
      const decoded = jwt.decode(token) as any;

      expect(decoded.userId).toBe(1);
      expect(decoded.role).toBe("tenant");
      expect(decoded.email).toBe("test@example.com");
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it("should set expiry in the future", () => {
      const token = generateAccessToken(testUser);
      const decoded = jwt.decode(token) as any;
      expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate a JWT with tokenType refresh", () => {
      const token = generateRefreshToken(testUser);
      const decoded = jwt.decode(token) as any;

      expect(decoded.userId).toBe(1);
      expect(decoded.role).toBe("tenant");
      expect(decoded.tokenType).toBe("refresh");
    });

    it("should have longer expiry than access token", () => {
      const access = jwt.decode(generateAccessToken(testUser)) as any;
      const refresh = jwt.decode(generateRefreshToken(testUser)) as any;
      expect(refresh.exp - refresh.iat).toBeGreaterThan(access.exp - access.iat);
    });
  });

  describe("verifyToken", () => {
    it("should verify a valid access token", () => {
      const token = generateAccessToken(testUser);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(1);
      expect(decoded.role).toBe("tenant");
      expect(decoded.email).toBe("test@example.com");
    });

    it("should verify a valid refresh token", () => {
      const token = generateRefreshToken(testUser);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(1);
      expect(decoded.tokenType).toBe("refresh");
    });

    it("should throw on tampered token", () => {
      const token = generateAccessToken(testUser);
      const tampered = token.slice(0, -5) + "XXXXX";
      expect(() => verifyToken(tampered)).toThrow();
    });

    it("should throw on random string", () => {
      expect(() => verifyToken("not-a-jwt")).toThrow();
    });

    it("should throw on token signed with different key", () => {
      const fakeToken = jwt.sign({ userId: 1, role: "tenant" }, "wrong-secret", { expiresIn: "15m" });
      expect(() => verifyToken(fakeToken)).toThrow();
    });
  });
});
