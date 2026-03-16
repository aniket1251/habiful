// Feature: self-auth, Property 14: Bearer Token Injection
import fc from "fast-check";
import { setAccessToken, getAccessToken } from "@/state/api";

describe("Property 14: Bearer Token Injection", () => {
  it("should store and retrieve access token correctly for any token string", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 500 }),
        (token) => {
          setAccessToken(token);
          expect(getAccessToken()).toBe(token);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should return null when token is cleared", () => {
    setAccessToken("some-token");
    setAccessToken(null);
    expect(getAccessToken()).toBeNull();
  });
});
