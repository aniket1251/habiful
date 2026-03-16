import { signUpSchema } from "@/lib/schemas";

const validData = {
  name: "Test User",
  email: "test@example.com",
  password: "Password1",
  confirmPassword: "Password1",
  phoneNumber: "1234567890",
  role: "tenant" as const,
};

describe("Sign-Up Form Schema", () => {
  it("should accept valid registration data", () => {
    expect(signUpSchema.safeParse(validData).success).toBe(true);
  });

  it("should reject empty name", () => {
    expect(signUpSchema.safeParse({ ...validData, name: "" }).success).toBe(false);
  });

  it("should reject invalid email", () => {
    expect(signUpSchema.safeParse({ ...validData, email: "bad" }).success).toBe(false);
  });

  it("should reject short password", () => {
    expect(signUpSchema.safeParse({ ...validData, password: "Pass1", confirmPassword: "Pass1" }).success).toBe(false);
  });

  it("should reject password without uppercase", () => {
    expect(signUpSchema.safeParse({ ...validData, password: "password1", confirmPassword: "password1" }).success).toBe(false);
  });

  it("should reject password without lowercase", () => {
    expect(signUpSchema.safeParse({ ...validData, password: "PASSWORD1", confirmPassword: "PASSWORD1" }).success).toBe(false);
  });

  it("should reject password without digit", () => {
    expect(signUpSchema.safeParse({ ...validData, password: "Passwordd", confirmPassword: "Passwordd" }).success).toBe(false);
  });

  it("should reject mismatched passwords", () => {
    expect(signUpSchema.safeParse({ ...validData, confirmPassword: "Different1" }).success).toBe(false);
  });

  it("should reject invalid role", () => {
    expect(signUpSchema.safeParse({ ...validData, role: "admin" }).success).toBe(false);
  });

  it("should accept manager role", () => {
    expect(signUpSchema.safeParse({ ...validData, role: "manager" }).success).toBe(true);
  });

  it("should reject short phone number", () => {
    expect(signUpSchema.safeParse({ ...validData, phoneNumber: "123" }).success).toBe(false);
  });
});
