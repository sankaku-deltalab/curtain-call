import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { Actor, injectTokens } from "../../src";

describe("@curtain-call/ia-user-controller.Actor", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(Actor);

    expect(impl).toBeInstanceOf(Actor);
  });
});
