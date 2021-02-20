import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorsUpdateEventEmitterImpl, injectTokens } from "../../src";

describe("@curtain-call/uc-actor.ActorsUpdateEventEmitterImpl", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(ActorsUpdateEventEmitterImpl);

    expect(impl).toBeInstanceOf(ActorsUpdateEventEmitterImpl);
  });
});
