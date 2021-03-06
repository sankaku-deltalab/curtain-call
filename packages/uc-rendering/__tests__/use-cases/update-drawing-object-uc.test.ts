import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { UpdateDrawingObjectUC, injectTokens } from "../../src";

describe("@curtain-call/uc-rendering.UpdateDrawingObjectUC", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(UpdateDrawingObjectUC);

    expect(uc).toBeInstanceOf(UpdateDrawingObjectUC);
  });
});
