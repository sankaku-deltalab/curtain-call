import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { CollisionStorageImpl } from "../../src";

describe("@curtain-call/ia-collision.CollisionStorageImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();

    const storage = subContainer.resolve(CollisionStorageImpl);

    expect(storage).toBeInstanceOf(CollisionStorageImpl);
  });
});
