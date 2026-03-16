import { validateEmail, validatePassword, validateRole } from "../../../src/utils/validationUtils";

describe("Validation Utils", () => {
  describe("validateEmail", () => {
    it("should accept valid email", () => {
      expect(validateEmail("user@example.com")).toEqual({ valid: true });
    });

    it("should reject empty string", () => {
      expect(validateEmail("").valid).toBe(false);
    });

    it("should reject missing @", () => {
      expect(validateEmail("userexample.com").valid).toBe(false);
    });

    it("should reject missing domain", () => {
      expect(validateEmail("user@").valid).toBe(false);
    });

    it("should reject missing local part", () => {
      expect(validateEmail("@example.com").valid).toBe(false);
    });

    it("should accept email with special chars", () => {
      expect(validateEmail("user+tag@example.co.in")).toEqual({ valid: true });
    });
  });

  describe("validatePassword", () => {
    it("should accept valid password", () => {
      expect(validatePassword("Password1")).toEqual({ valid: true, errors: [] });
    });

    it("should reject password shorter than 8 chars", () => {
      const result = validatePassword("Pass1");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must be at least 8 characters long");
    });

    it("should reject exactly 7 char password", () => {
      expect(validatePassword("Passwor").valid).toBe(false);
    });

    it("should accept exactly 8 char password meeting all rules", () => {
      expect(validatePassword("Abcdefg1")).toEqual({ valid: true, errors: [] });
    });

    it("should reject password without uppercase", () => {
      const result = validatePassword("password1");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one uppercase letter");
    });

    it("should reject password without lowercase", () => {
      const result = validatePassword("PASSWORD1");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one lowercase letter");
    });

    it("should reject password without digit", () => {
      const result = validatePassword("Passwordd");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one digit");
    });

    it("should return multiple errors for very weak password", () => {
      const result = validatePassword("abc");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("validateRole", () => {
    it("should accept tenant", () => {
      expect(validateRole("tenant")).toEqual({ valid: true });
    });

    it("should accept manager", () => {
      expect(validateRole("manager")).toEqual({ valid: true });
    });

    it("should accept case-insensitive Tenant", () => {
      expect(validateRole("Tenant")).toEqual({ valid: true });
    });

    it("should reject invalid role", () => {
      expect(validateRole("admin").valid).toBe(false);
    });

    it("should reject empty string", () => {
      expect(validateRole("").valid).toBe(false);
    });
  });
});
