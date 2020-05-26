import { World } from "../src";

describe("curtain-call", () => {
  it("has World", () => {
    expect(() => new World()).not.toThrowError();
  });
});
