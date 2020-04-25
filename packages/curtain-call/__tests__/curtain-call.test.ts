import { Scene } from "../src";

describe("curtain-call", () => {
  it("has Scene", () => {
    expect(() => new Scene()).not.toThrowError();
  });
});
