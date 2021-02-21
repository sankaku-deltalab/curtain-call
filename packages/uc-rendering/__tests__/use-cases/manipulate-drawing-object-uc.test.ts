import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ManipulateDrawingObjectUC, injectTokens } from "../../src";

describe("@curtain-call/uc-rendering.ManipulateDrawingObjectUC", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(ManipulateDrawingObjectUC);

    expect(uc).toBeInstanceOf(ManipulateDrawingObjectUC);
  });
});
