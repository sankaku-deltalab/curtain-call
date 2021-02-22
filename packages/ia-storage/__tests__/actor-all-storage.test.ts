import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorAllStorage, injectTokens } from "../src";

describe("@curtain-call/ia-storage.ActorStorageImpl", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(ActorAllStorage);

    expect(impl).toBeInstanceOf(ActorAllStorage);
  });
});
