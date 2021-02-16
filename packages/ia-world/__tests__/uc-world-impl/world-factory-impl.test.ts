import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { WorldFactoryImpl, injectTokens } from "../../src";

describe("@curtain-call/ia-world.WorldFactoryImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });
    subContainer.register(injectTokens.DIContainer, { useValue: subContainer });

    const impl = subContainer.resolve(WorldFactoryImpl);

    expect(impl).toBeInstanceOf(WorldFactoryImpl);
  });
});
