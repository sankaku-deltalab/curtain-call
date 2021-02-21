import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { CreateDrawingObjectUC, injectTokens } from "../../src";

describe("@curtain-call/uc-rendering.CreateDrawingObjectUC", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(CreateDrawingObjectUC);

    expect(uc).toBeInstanceOf(CreateDrawingObjectUC);
  });
});
