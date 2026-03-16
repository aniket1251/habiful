// Feature: self-auth, Property 3: Email Validation Rejects Invalid Formats
import fc from "fast-check";
import { validateEmail } from "../../../src/utils/validationUtils";

describe("Property 3: Email Validation Rejects Invalid Formats", () => {
  it("should reject strings without @ symbol", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter((s) => !s.includes("@")),
        (input) => {
          expect(validateEmail(input).valid).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should reject empty strings", () => {
    expect(validateEmail("").valid).toBe(false);
  });

  it("should reject strings with @ but no domain part", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => !s.includes("@") && !s.includes(" ")),
        (local) => {
          expect(validateEmail(`${local}@`).valid).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should accept valid email formats", () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.stringOf(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz0123456789".split("")), { minLength: 1, maxLength: 10 }),
          fc.stringOf(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz".split("")), { minLength: 1, maxLength: 10 }),
          fc.constantFrom("com", "org", "net", "io")
        ),
        ([local, domain, tld]) => {
          expect(validateEmail(`${local}@${domain}.${tld}`).valid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
