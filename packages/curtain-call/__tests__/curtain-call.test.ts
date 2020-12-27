import { Actor, World, ActorManipulator } from "../src";

describe("curtain-call", () => {
  it("has actor", () => {
    expect(() => new Actor()).not.toThrowError();
  });

  it("has world", () => {
    expect(() => new World()).not.toThrowError();
  });

  it("has actor-manipulator", () => {
    expect(() => new ActorManipulator()).not.toThrowError();
  });
});
