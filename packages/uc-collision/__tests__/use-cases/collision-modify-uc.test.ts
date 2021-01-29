import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { CollisionModifyUC, injectTokens } from "../../src";

describe("@curtain-call/uc-collision.CollisionModifyUC", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(CollisionModifyUC);

    expect(uc).toBeInstanceOf(CollisionModifyUC);
  });
});
