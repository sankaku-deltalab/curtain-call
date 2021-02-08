import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorsMoverImpl, injectTokens } from "../src";

describe("@curtain-call/entity.ActorsMoverImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const mover = subContainer.resolve(ActorsMoverImpl);

    expect(mover).toBeInstanceOf(ActorsMoverImpl);
  });
});
