import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { WorldStorageImpl, injectTokens } from "../../src";

describe("@curtain-call/ia-world.WorldStorageImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(WorldStorageImpl);

    expect(impl).toBeInstanceOf(WorldStorageImpl);
  });
});
