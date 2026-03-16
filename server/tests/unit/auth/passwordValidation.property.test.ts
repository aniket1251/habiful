// Feature: self-auth, Property 2: Password Validation Rejects Weak Passwords
import fc from "fast-check";
import { validatePassword } from "../../../src/utils/validationUtils";

describe("Property 2: Password Validation Rejects Weak Passwords", () => {
  it("should reject strings shorter than 8 characters", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 7 }), (password) => {
        const result = validatePassword(password);
        expect(result.valid).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it("should reject strings without uppercase letters", () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz0123456789".split("")), { minLength: 8, maxLength: 30 }),
        (password) => {
          const result = validatePassword(password);
          expect(result.valid).toBe(false);
          expect(result.errors).toContain("Password must contain at least one uppercase letter");
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should reject strings without lowercase letters", () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom(..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("")), { minLength: 8, maxLength: 30 }),
        (password) => {
          const result = validatePassword(password);
          expect(result.valid).toBe(false);
          expect(result.errors).toContain("Password must contain at least one lowercase letter");
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should reject strings without digits", () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")), { minLength: 8, maxLength: 30 }),
        (password) => {
          const result = validatePassword(password);
          expect(result.valid).toBe(false);
          expect(result.errors).toContain("Password must contain at least one digit");
        }
      ),
      { numRuns: 100 }
    );
  });
});
