import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorUpdateEventEmitterStorageImpl, injectTokens } from "../../src";

describe("@curtain-call/ia-actor.ActorUpdateEventEmitterStorageImpl", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(ActorUpdateEventEmitterStorageImpl);

    expect(impl).toBeInstanceOf(ActorUpdateEventEmitterStorageImpl);
  });
});
