import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorsOverlapCheckerImpl, injectTokens } from "../../src";

describe("@curtain-call/uc-collision.ActorsOverlapCheckerImpl", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const overlapChecker = subContainer.resolve(ActorsOverlapCheckerImpl);

    expect(overlapChecker).toBeInstanceOf(ActorsOverlapCheckerImpl);
  });
});
