import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorsContainerImpl, injectTokens } from "../../src";

describe("@curtain-call/uc-world.ActorsContainerImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(ActorsContainerImpl);

    expect(impl).toBeInstanceOf(ActorsContainerImpl);
  });
});
