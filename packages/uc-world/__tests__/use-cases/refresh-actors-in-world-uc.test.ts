import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { RefreshActorsInWorldUC, injectTokens } from "../../src";

describe("@curtain-call/uc-world.RefreshActorsInWorldUC", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(RefreshActorsInWorldUC);

    expect(uc).toBeInstanceOf(RefreshActorsInWorldUC);
  });
});
