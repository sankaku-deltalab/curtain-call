import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorComponentDestroyerImpl, injectTokens } from "../../src";

describe("@curtain-call/ia-actor.ActorComponentDestroyerImpl", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(ActorComponentDestroyerImpl);

    expect(impl).toBeInstanceOf(ActorComponentDestroyerImpl);
  });
});
