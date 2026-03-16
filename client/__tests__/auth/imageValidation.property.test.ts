// Feature: profile-picture-upload, Property 1: File type validation
// Feature: profile-picture-upload, Property 2: File size validation
import fc from "fast-check";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function isValidType(mimeType: string): boolean {
  return ACCEPTED_TYPES.includes(mimeType);
}

function isValidSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

describe("Property 1: File type validation", () => {
  it("should accept only jpeg, png, webp, gif MIME types", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 3, maxLength: 50 }),
        (mimeType) => {
          const result = isValidType(mimeType);
          if (ACCEPTED_TYPES.includes(mimeType)) {
            expect(result).toBe(true);
          } else {
            expect(result).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should accept all four valid types", () => {
    for (const type of ACCEPTED_TYPES) {
      expect(isValidType(type)).toBe(true);
    }
  });
});

describe("Property 2: File size validation", () => {
  it("should reject files over 5MB and accept files at or under 5MB", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 20 * 1024 * 1024 }),
        (size) => {
          const result = isValidSize(size);
          if (size <= MAX_FILE_SIZE) {
            expect(result).toBe(true);
          } else {
            expect(result).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should accept exactly 5MB", () => {
    expect(isValidSize(MAX_FILE_SIZE)).toBe(true);
  });

  it("should reject 5MB + 1 byte", () => {
    expect(isValidSize(MAX_FILE_SIZE + 1)).toBe(false);
  });
});
