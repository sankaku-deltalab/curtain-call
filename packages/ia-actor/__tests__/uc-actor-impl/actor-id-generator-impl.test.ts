import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorIdGeneratorImpl, injectTokens } from "../../src";

describe("@curtain-call/ia-actor.ActorIdGeneratorImpl", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(ActorIdGeneratorImpl);

    expect(impl).toBeInstanceOf(ActorIdGeneratorImpl);
  });
});
