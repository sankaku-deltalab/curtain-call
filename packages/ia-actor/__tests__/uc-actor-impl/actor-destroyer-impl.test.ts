import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorDestroyerImpl, injectTokens } from "../../src";

describe("@curtain-call/ia-actor.ActorDestroyerImpl", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(ActorDestroyerImpl);

    expect(impl).toBeInstanceOf(ActorDestroyerImpl);
  });
});
