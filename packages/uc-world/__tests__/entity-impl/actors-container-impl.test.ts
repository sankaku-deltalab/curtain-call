import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorsContainerImpl } from "../../src";

describe("@curtain-call/uc-world.ActorsContainerImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();

    const impl = subContainer.resolve(ActorsContainerImpl);

    expect(impl).toBeInstanceOf(ActorsContainerImpl);
  });
});
