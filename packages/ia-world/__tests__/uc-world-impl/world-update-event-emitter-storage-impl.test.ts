import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { WorldUpdateEventEmitterStorageImpl, injectTokens } from "../../src";

describe("@curtain-call/ia-world.WorldUpdateEventEmitterStorageImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(WorldUpdateEventEmitterStorageImpl);

    expect(impl).toBeInstanceOf(WorldUpdateEventEmitterStorageImpl);
  });
});
