// Feature: profile-picture-upload, Property 4: Upload URL storage round-trip
import fc from "fast-check";

const mockUploadStream = jest.fn();
jest.mock("../../../src/config/cloudinary", () => ({
  __esModule: true,
  default: { uploader: { upload_stream: mockUploadStream } },
}));

import { uploadToCloudinary } from "../../../src/utils/uploadUtils";

describe("Property 4: Upload URL storage round-trip", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return the exact secure_url from Cloudinary for any upload", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.webUrl(),
        async (fakeUrl) => {
          mockUploadStream.mockImplementation((opts: any, cb: any) => {
            cb(null, { secure_url: fakeUrl });
            return { end: jest.fn() };
          });
          const result = await uploadToCloudinary(Buffer.from("img"), "test-id", "profile-pictures");
          expect(result).toBe(fakeUrl);
        }
      ),
      { numRuns: 100 }
    );
  });
});
