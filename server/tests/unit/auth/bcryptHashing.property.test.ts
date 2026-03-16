// Feature: self-auth, Property 7: Bcrypt Hashing Invariants
import fc from "fast-check";
import bcrypt from "bcryptjs";

describe("Property 7: Bcrypt Hashing Invariants", () => {
  it("should produce hash with cost factor >= 10, not equal plaintext, and unique salt per hash", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 8, maxLength: 50 }),
        async (password) => {
          const hash1 = await bcrypt.hash(password, 10);
          const hash2 = await bcrypt.hash(password, 10);

          // Cost factor >= 10
          const costMatch = hash1.match(/\$2[aby]?\$(\d+)\$/);
          expect(costMatch).not.toBeNull();
          expect(Number(costMatch![1])).toBeGreaterThanOrEqual(10);

          // Hash should not equal plaintext
          expect(hash1).not.toBe(password);

          // Two hashes of same password should differ (unique salt)
          expect(hash1).not.toBe(hash2);

          // Both should verify against the original password
          expect(await bcrypt.compare(password, hash1)).toBe(true);
          expect(await bcrypt.compare(password, hash2)).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  }, 60000);
});
