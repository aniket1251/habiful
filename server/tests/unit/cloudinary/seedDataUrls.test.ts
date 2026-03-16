// Feature: s3-to-cloudinary-migration, Property 6: Seed data contains no S3 URLs
import fs from "fs";
import path from "path";

const seedDataPath = path.join(__dirname, "../../../prisma/seedData/property.json");
const properties = JSON.parse(fs.readFileSync(seedDataPath, "utf-8"));

describe("Property 6: Seed data contains no S3 URLs", () => {
  it("should not contain any S3 hostname patterns in photoUrls", () => {
    const s3Pattern = /\.s3\..*\.amazonaws\.com/;

    for (const property of properties) {
      for (const url of property.photoUrls) {
        expect(url).not.toMatch(s3Pattern);
      }
    }
  });
});

describe("Seed data URL validity", () => {
  it("all photoUrls should be valid HTTPS URLs", () => {
    for (const property of properties) {
      expect(property.photoUrls.length).toBeGreaterThan(0);
      for (const url of property.photoUrls) {
        expect(url).toMatch(/^https:\/\/.+/);
      }
    }
  });

  it("every property should have at least one photo URL", () => {
    for (const property of properties) {
      expect(property.photoUrls.length).toBeGreaterThanOrEqual(1);
    }
  });
});
