import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { CollisionStorageImpl, injectTokens } from "../../src";

describe("@curtain-call/ia-storage.CollisionStorageImpl", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(CollisionStorageImpl);

    expect(impl).toBeInstanceOf(CollisionStorageImpl);
  });
});
