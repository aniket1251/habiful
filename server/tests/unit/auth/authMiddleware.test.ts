import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../../../src/middlewares/authMiddleware";
import { generateAccessToken } from "../../../src/utils/tokenUtils";

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

describe("Auth Middleware", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no Authorization header", () => {
    const req = { headers: {} } as Request;
    const res = mockResponse();
    authMiddleware(["tenant"])(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 for invalid token", () => {
    const req = { headers: { authorization: "Bearer invalid-token" } } as Request;
    const res = mockResponse();
    authMiddleware(["tenant"])(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should attach user and call next for valid token with allowed role", () => {
    const token = generateAccessToken({ id: 42, role: "tenant", email: "t@test.com" });
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    const res = mockResponse();
    authMiddleware(["tenant"])(req, res, mockNext);
    expect(req.user).toEqual({ id: 42, role: "tenant" });
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 403 when role is not in allowed list", () => {
    const token = generateAccessToken({ id: 1, role: "tenant", email: "t@test.com" });
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    const res = mockResponse();
    authMiddleware(["manager"])(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Access Denied" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should allow manager role on manager-restricted route", () => {
    const token = generateAccessToken({ id: 5, role: "manager", email: "m@test.com" });
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    const res = mockResponse();
    authMiddleware(["manager"])(req, res, mockNext);
    expect(req.user).toEqual({ id: 5, role: "manager" });
    expect(mockNext).toHaveBeenCalled();
  });

  it("should allow both roles when both are specified", () => {
    const token = generateAccessToken({ id: 3, role: "tenant", email: "t@test.com" });
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    const res = mockResponse();
    authMiddleware(["tenant", "manager"])(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should set user id as number, not string", () => {
    const token = generateAccessToken({ id: 99, role: "tenant", email: "t@test.com" });
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    const res = mockResponse();
    authMiddleware(["tenant"])(req, res, mockNext);
    expect(typeof req.user?.id).toBe("number");
  });
});
