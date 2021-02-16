import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { CreateWorldUC, injectTokens } from "../../src";

describe("@curtain-call/uc-world.CreateWorldUC", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });

    const uc = subContainer.resolve(CreateWorldUC);

    expect(uc).toBeInstanceOf(CreateWorldUC);
  });
});
