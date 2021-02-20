import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorStorageImpl, injectTokens } from "../../src";

describe("@curtain-call/ia-actor.ActorStorageImpl", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(ActorStorageImpl);

    expect(impl).toBeInstanceOf(ActorStorageImpl);
  });
});
