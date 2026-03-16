// Feature: self-auth, Properties 9, 10, 11
import fc from "fast-check";
import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../../../src/middlewares/authMiddleware";
import { generateAccessToken } from "../../../src/utils/tokenUtils";

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Property 9: Invalid Token Rejection by Middleware
describe("Property 9: Invalid Token Rejection by Middleware", () => {
  it("should return 401 for any random string as token", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter((s) => !s.includes(".")),
        (randomStr) => {
          const req = { headers: { authorization: `Bearer ${randomStr}` } } as Request;
          const res = mockResponse();
          const next = jest.fn();
          authMiddleware(["tenant"])(req, res, next);
          expect(res.status).toHaveBeenCalledWith(401);
          expect(next).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Property 10: Middleware Extracts Correct User Identity
describe("Property 10: Middleware Extracts Correct User Identity", () => {
  it("should extract correct userId and role from valid tokens", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100000 }),
        fc.constantFrom("tenant", "manager"),
        (userId, role) => {
          const token = generateAccessToken({ id: userId, role, email: `u${userId}@test.com` });
          const req = { headers: { authorization: `Bearer ${token}` } } as Request;
          const res = mockResponse();
          const next = jest.fn();
          authMiddleware([role])(req, res, next);
          expect(req.user?.id).toBe(userId);
          expect(req.user?.role).toBe(role);
          expect(typeof req.user?.id).toBe("number");
          expect(next).toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Property 11: Role-Based Access Control Enforcement
describe("Property 11: Role-Based Access Control Enforcement", () => {
  it("should return 403 when tenant accesses manager routes", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100000 }),
        (userId) => {
          const token = generateAccessToken({ id: userId, role: "tenant", email: `t${userId}@test.com` });
          const req = { headers: { authorization: `Bearer ${token}` } } as Request;
          const res = mockResponse();
          const next = jest.fn();
          authMiddleware(["manager"])(req, res, next);
          expect(res.status).toHaveBeenCalledWith(403);
          expect(next).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should return 403 when manager accesses tenant routes", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100000 }),
        (userId) => {
          const token = generateAccessToken({ id: userId, role: "manager", email: `m${userId}@test.com` });
          const req = { headers: { authorization: `Bearer ${token}` } } as Request;
          const res = mockResponse();
          const next = jest.fn();
          authMiddleware(["tenant"])(req, res, next);
          expect(res.status).toHaveBeenCalledWith(403);
          expect(next).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });
});
