import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { UpdateActorUC, injectTokens } from "../../src";

describe("@curtain-call/uc-actor.UpdateActorUC", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(UpdateActorUC);

    expect(uc).toBeInstanceOf(UpdateActorUC);
  });
});
