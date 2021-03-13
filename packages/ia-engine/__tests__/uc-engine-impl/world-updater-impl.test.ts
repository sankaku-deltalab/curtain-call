import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { WorldUpdaterImpl, injectTokens } from "../../src";

describe("@curtain-call/ia-engine.WorldUpdaterImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(WorldUpdaterImpl);

    expect(impl).toBeInstanceOf(WorldUpdaterImpl);
  });
});
