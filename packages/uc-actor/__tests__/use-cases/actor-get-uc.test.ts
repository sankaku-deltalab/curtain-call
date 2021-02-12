import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorGetUC, injectTokens } from "../../src";

describe("@curtain-call/uc-actor.ActorGetUC", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(ActorGetUC);

    expect(uc).toBeInstanceOf(ActorGetUC);
  });
});
