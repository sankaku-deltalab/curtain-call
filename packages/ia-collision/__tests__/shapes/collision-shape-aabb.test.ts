import { CollisionShapeAABB } from "../../src";

describe("@curtain-call/ia-collision.CollisionShapeAABB", () => {
  it("can init with size", () => {
    const size = { x: 1, y: 2 };
    const shape = new CollisionShapeAABB();
    const r = shape.init(size);

    expect(r).toBe(shape);
  });
});
