import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { RegisterRendererUC, injectTokens } from "../../src";

describe("@curtain-call/uc-rendering.RegisterRendererUC", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(RegisterRendererUC);

    expect(uc).toBeInstanceOf(RegisterRendererUC);
  });
});
