import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { WorldUpdatingInEngineUC, injectTokens } from "../../src";

describe("@curtain-call/uc-engine.WorldUpdatingInEngineUC", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(WorldUpdatingInEngineUC);

    expect(uc).toBeInstanceOf(WorldUpdatingInEngineUC);
  });
});
