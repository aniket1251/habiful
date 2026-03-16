import { signInSchema } from "@/lib/schemas";

describe("Sign-In Form Schema", () => {
  it("should accept valid email and password", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty email", () => {
    const result = signInSchema.safeParse({ email: "", password: "password123" });
    expect(result.success).toBe(false);
  });

  it("should reject invalid email format", () => {
    const result = signInSchema.safeParse({ email: "notanemail", password: "password123" });
    expect(result.success).toBe(false);
  });

  it("should reject empty password", () => {
    const result = signInSchema.safeParse({ email: "user@example.com", password: "" });
    expect(result.success).toBe(false);
  });

  it("should reject missing fields", () => {
    const result = signInSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
