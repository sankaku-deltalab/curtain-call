import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorDestroyingRequesterImpl, injectTokens } from "../../src";

describe("@curtain-call/ia-world.ActorDestroyingRequesterImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(ActorDestroyingRequesterImpl);

    expect(impl).toBeInstanceOf(ActorDestroyingRequesterImpl);
  });
});
