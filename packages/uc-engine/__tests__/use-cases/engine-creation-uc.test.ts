import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { EngineCreationUC, injectTokens } from "../../src";

describe("@curtain-call/uc-engine.En", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(EngineCreationUC);

    expect(uc).toBeInstanceOf(EngineCreationUC);
  });
});
