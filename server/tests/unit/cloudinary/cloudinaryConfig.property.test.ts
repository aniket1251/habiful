// Feature: s3-to-cloudinary-migration, Property 3: Missing Cloudinary env var prevents initialization
/// <reference types="jest" />

// Mock dotenv so it doesn't reload from .env file during tests
jest.mock("dotenv", () => ({ config: jest.fn() }));

describe("Property 3: Missing Cloudinary env var prevents initialization", () => {
  const requiredVars = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
  const originals: Record<string, string | undefined> = {};

  beforeEach(() => {
    requiredVars.forEach((v) => { originals[v] = process.env[v]; });
    jest.resetModules();
  });

  afterEach(() => {
    requiredVars.forEach((v) => {
      if (originals[v] !== undefined) process.env[v] = originals[v];
      else delete process.env[v];
    });
  });

  it("should exit when CLOUDINARY_CLOUD_NAME is missing", () => {
    delete process.env.CLOUDINARY_CLOUD_NAME;
    process.env.CLOUDINARY_API_KEY = "123";
    process.env.CLOUDINARY_API_SECRET = "secret";
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => undefined as never);
    jest.isolateModules(() => { require("../../../src/config/cloudinary"); });
    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
  });

  it("should exit when CLOUDINARY_API_KEY is missing", () => {
    process.env.CLOUDINARY_CLOUD_NAME = "test";
    delete process.env.CLOUDINARY_API_KEY;
    process.env.CLOUDINARY_API_SECRET = "secret";
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => undefined as never);
    jest.isolateModules(() => { require("../../../src/config/cloudinary"); });
    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
  });

  it("should exit when CLOUDINARY_API_SECRET is missing", () => {
    process.env.CLOUDINARY_CLOUD_NAME = "test";
    process.env.CLOUDINARY_API_KEY = "123";
    delete process.env.CLOUDINARY_API_SECRET;
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => undefined as never);
    jest.isolateModules(() => { require("../../../src/config/cloudinary"); });
    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
  });

  it("should not exit when all vars are present", () => {
    process.env.CLOUDINARY_CLOUD_NAME = "test";
    process.env.CLOUDINARY_API_KEY = "123";
    process.env.CLOUDINARY_API_SECRET = "secret";
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => undefined as never);
    jest.isolateModules(() => { require("../../../src/config/cloudinary"); });
    expect(mockExit).not.toHaveBeenCalled();
    mockExit.mockRestore();
  });
});
