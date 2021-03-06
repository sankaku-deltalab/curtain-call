import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorFactory, injectTokens } from "../../src";

describe("@curtain-call/ia-user-controller.ActorFactory", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });
    subContainer.register(injectTokens.DIContainer, { useValue: subContainer });

    const impl = subContainer.resolve(ActorFactory);

    expect(impl).toBeInstanceOf(ActorFactory);
  });
});
