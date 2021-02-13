import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { UpdateWorldUC, injectTokens } from "../../src";

describe("@curtain-call/uc-world.UpdateWorldUC", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(UpdateWorldUC);

    expect(uc).toBeInstanceOf(UpdateWorldUC);
  });
});
