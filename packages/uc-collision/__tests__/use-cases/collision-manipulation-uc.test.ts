import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { CollisionManipulationUC, injectTokens } from "../../src";

describe("@curtain-call/uc-collision.CollisionManipulationUC", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(CollisionManipulationUC);

    expect(uc).toBeInstanceOf(CollisionManipulationUC);
  });
});
