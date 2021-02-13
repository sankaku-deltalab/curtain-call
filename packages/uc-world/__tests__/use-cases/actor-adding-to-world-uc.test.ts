import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorAddingToWorldUC, injectTokens } from "../../src";

describe("@curtain-call/uc-world.ActorAddingToWorldUC", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(ActorAddingToWorldUC);

    expect(uc).toBeInstanceOf(ActorAddingToWorldUC);
  });
});
