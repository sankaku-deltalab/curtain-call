import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { CollisionShapeSingleRect } from "../../../src";

describe("@curtain-call/ia-collision.CollisionShapeSingleRect", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();

    const rect = subContainer.resolve(CollisionShapeSingleRect);

    expect(rect).toBeInstanceOf(CollisionShapeSingleRect);
  });
});
