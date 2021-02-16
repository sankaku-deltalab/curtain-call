import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { WorldStorageImpl } from "../../src";

describe("@curtain-call/ia-world.WorldStorageImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();

    const impl = subContainer.resolve(WorldStorageImpl);

    expect(impl).toBeInstanceOf(WorldStorageImpl);
  });
});
