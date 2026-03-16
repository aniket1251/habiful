// Feature: s3-to-cloudinary-migration, Property 1: Upload produces matching secure_urls
// Feature: s3-to-cloudinary-migration, Property 2: Upload parameters use correct folder and public ID format
// Feature: s3-to-cloudinary-migration, Property 4: Upload failure returns HTTP 500
import fc from "fast-check";

const mockUploadStream = jest.fn();
jest.mock("../../../src/config/cloudinary", () => ({
  __esModule: true,
  default: {
    uploader: {
      upload_stream: mockUploadStream,
    },
  },
}));

import { uploadToCloudinary } from "../../../src/utils/uploadUtils";

describe("Property 1: Upload produces matching secure_urls", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return secure_url for any valid buffer", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 5, maxLength: 30 }).filter((s) => /^[a-zA-Z0-9]+$/.test(s)),
        async (filename) => {
          const fakeUrl = `https://res.cloudinary.com/test/image/upload/properties/${filename}`;
          mockUploadStream.mockImplementation((opts: any, cb: any) => {
            cb(null, { secure_url: fakeUrl });
            return { end: jest.fn() };
          });
          const url = await uploadToCloudinary(Buffer.from("fake"), `${Date.now()}-${filename}`);
          expect(url).toBe(fakeUrl);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("Property 2: Upload parameters use correct folder and public ID format", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should pass folder 'properties' and correct public_id", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 3, maxLength: 20 }).filter((s) => /^[a-zA-Z0-9]+$/.test(s)),
        async (filename) => {
          let capturedOpts: any = null;
          mockUploadStream.mockImplementation((opts: any, cb: any) => {
            capturedOpts = opts;
            cb(null, { secure_url: "https://example.com/img.jpg" });
            return { end: jest.fn() };
          });
          const publicId = `${Date.now()}-${filename}`;
          await uploadToCloudinary(Buffer.from("data"), publicId);
          expect(capturedOpts.folder).toBe("properties");
          expect(capturedOpts.public_id).toBe(publicId);
          expect(capturedOpts.resource_type).toBe("image");
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("Property 4: Upload failure returns rejection", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should reject when upload_stream returns an error", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 3, maxLength: 50 }).filter((s) => s.length > 0),
        async (errorMsg) => {
          mockUploadStream.mockImplementation((opts: any, cb: any) => {
            cb(new Error(errorMsg), null);
            return { end: jest.fn() };
          });
          await expect(uploadToCloudinary(Buffer.from("data"), "test-id")).rejects.toThrow(errorMsg);
        }
      ),
      { numRuns: 100 }
    );
  });
});
