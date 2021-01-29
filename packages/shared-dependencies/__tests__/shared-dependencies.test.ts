import "reflect-metadata";
import {
  Vector,
  inject,
  injectable,
  autoInjectable,
  singleton,
  container,
} from "../src";

describe("@curtain-call/shared-dependencies", () => {
  it("has 2d vector", () => {
    expect(() => new Vector(1, 2)).not.toThrowError();
  });

  it("has injection function and object from tsyringe", () => {
    expect(inject).not.toBeUndefined();
    expect(injectable).not.toBeUndefined();
    expect(autoInjectable).not.toBeUndefined();
    expect(singleton).not.toBeUndefined();
    expect(container).not.toBeUndefined();
  });
});
