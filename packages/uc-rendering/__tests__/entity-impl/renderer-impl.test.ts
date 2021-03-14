import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { RendererImpl, injectTokens } from "../../src";

describe("@curtain-call/uc-rendering.RendererImpl", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const impl = subContainer.resolve(RendererImpl);

    expect(impl).toBeInstanceOf(RendererImpl);
  });
});
