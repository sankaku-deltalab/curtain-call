import { Actor, World } from "../src";

describe("curtain-call", () => {
  it("has actor", () => {
    expect(() => new Actor()).not.toThrowError();
  });

  it("has world", () => {
    expect(() => new World()).not.toThrowError();
  });
});
