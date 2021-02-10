import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { BoxIntersectImpl } from "../../src";

describe("@curtain-call/fw-collision.BoxIntersectImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();

    const bi = subContainer.resolve(BoxIntersectImpl);

    expect(bi).toBeInstanceOf(BoxIntersectImpl);
  });
});
