import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { WorldAllStorage, injectTokens } from "../src";

describe("@curtain-call/ia-storage.WorldAllStorage", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(WorldAllStorage);

    expect(impl).toBeInstanceOf(WorldAllStorage);
  });
});
