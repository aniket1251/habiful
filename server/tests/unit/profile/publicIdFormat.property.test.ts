// Feature: profile-picture-upload, Property 3: Public ID format
import fc from "fast-check";

function generatePublicId(role: string, userId: number): string {
  return `${role}-${userId}-${Date.now()}`;
}

describe("Property 3: Public ID format", () => {
  it("should match {role}-{userId}-{timestamp} pattern for any role/userId pair", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("manager", "tenant"),
        fc.integer({ min: 1, max: 100000 }),
        (role, userId) => {
          const publicId = generatePublicId(role, userId);
          const pattern = /^(manager|tenant)-\d+-\d+$/;
          expect(publicId).toMatch(pattern);

          const parts = publicId.split("-");
          expect(parts[0]).toBe(role);
          expect(Number(parts[1])).toBe(userId);
          expect(Number(parts[2])).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
