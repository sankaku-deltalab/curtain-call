import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { WorldIdGeneratorImpl } from "../../src";

describe("@curtain-call/ia-world.WorldIdGeneratorImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();

    const impl = subContainer.resolve(WorldIdGeneratorImpl);

    expect(impl).toBeInstanceOf(WorldIdGeneratorImpl);
  });
});
