import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { TransformationStorageImpl, injectTokens } from "../../src";

describe("@curtain-call/uc-collision.TransformationStorageImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const storage = subContainer.resolve(TransformationStorageImpl);

    expect(storage).toBeInstanceOf(TransformationStorageImpl);
  });
});
