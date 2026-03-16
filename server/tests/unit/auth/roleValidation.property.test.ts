// Feature: self-auth, Property 4: Role Validation Rejects Invalid Roles
import fc from "fast-check";
import { validateRole } from "../../../src/utils/validationUtils";

describe("Property 4: Role Validation Rejects Invalid Roles", () => {
  it("should reject any string that is not tenant or manager", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }).filter(
          (s) => s.toLowerCase() !== "tenant" && s.toLowerCase() !== "manager"
        ),
        (role) => {
          expect(validateRole(role).valid).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should accept tenant and manager in any case", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("tenant", "manager", "Tenant", "Manager", "TENANT", "MANAGER"),
        (role) => {
          expect(validateRole(role).valid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
