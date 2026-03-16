// Feature: self-auth, Property 12: Password Confirm Mismatch Prevents Submission
import fc from "fast-check";
import { signUpSchema } from "@/lib/schemas";

describe("Property 12: Password Confirm Mismatch Prevents Submission", () => {
  it("should reject when password and confirmPassword are different", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 8, maxLength: 30 }),
        fc.string({ minLength: 8, maxLength: 30 }),
        (password, confirmPassword) => {
          fc.pre(password !== confirmPassword);

          const result = signUpSchema.safeParse({
            name: "Test User",
            email: "test@example.com",
            password,
            confirmPassword,
            phoneNumber: "1234567890",
            role: "tenant",
          });

          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should accept when password and confirmPassword match and meet all rules", () => {
    fc.assert(
      fc.property(
        fc.stringOf(
          fc.constantFrom(..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("")),
          { minLength: 8, maxLength: 20 }
        ).filter((s) => /[A-Z]/.test(s) && /[a-z]/.test(s) && /[0-9]/.test(s)),
        (password) => {
          const result = signUpSchema.safeParse({
            name: "Test User",
            email: "test@example.com",
            password,
            confirmPassword: password,
            phoneNumber: "1234567890",
            role: "tenant",
          });

          expect(result.success).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
