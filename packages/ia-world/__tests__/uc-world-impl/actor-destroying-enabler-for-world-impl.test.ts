import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorDestroyingEnablerForWorldImpl } from "../../src";

describe("@curtain-call/ia-world.ActorDestroyingEnablerForWorldImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();

    const impl = subContainer.resolve(ActorDestroyingEnablerForWorldImpl);

    expect(impl).toBeInstanceOf(ActorDestroyingEnablerForWorldImpl);
  });
});
