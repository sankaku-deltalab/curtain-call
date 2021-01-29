import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { WorldCore, injectTokens } from "../src";

describe("@curtain-call/entity.WorldCore", () => {
  it("can create WorldCore from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const worldCore = subContainer.resolve(WorldCore);

    expect(worldCore).toBeInstanceOf(WorldCore);
  });
});
