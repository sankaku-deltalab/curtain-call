import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorCreateUC, injectTokens } from "../../src";

describe("@curtain-call/uc-actor.ActorCreateUC", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(ActorCreateUC);

    expect(uc).toBeInstanceOf(ActorCreateUC);
  });
});
