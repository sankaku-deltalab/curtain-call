import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { World, injectTokens } from "../../src";

describe("@curtain-call/ia-user-controller.World", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(World);

    expect(impl).toBeInstanceOf(World);
  });
});
