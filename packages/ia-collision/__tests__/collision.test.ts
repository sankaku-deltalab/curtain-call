import { Matrix } from "trans-vector2d";
import { Box2d } from "@curtain-call/entity";
import { CollisionShape } from "@curtain-call/uc-collision";
import { CollisionImpl } from "../src";

const collisionShapeMockClass = jest.fn<CollisionShape, [readonly Box2d[]]>(
  (boxes: readonly Box2d[]) => ({
    calcCollisionBox2ds: jest.fn().mockReturnValue(boxes),
  })
);

describe("@curtain-call/ia-collision.Collision", () => {
  it("calculate CollisionRepresentation from initialized values", () => {
    const boxes1: readonly Box2d[] = [
      [0, 0, 1, 1],
      [1, 2, 3, 4],
    ];
    const boxes2: readonly Box2d[] = [
      [0, 0, 2, 2],
      [10, 20, 30, 40],
    ];
    const shape1 = new collisionShapeMockClass(boxes1);
    const shape2 = new collisionShapeMockClass(boxes2);

    const group = {
      mask: 0b0001,
      category: 0b0101,
    };

    const isExcess = true;

    const collision = new CollisionImpl();
    collision.init({
      shapes: [shape1, shape2],
      group,
      isExcess,
    });

    const parentTrans = Matrix.from({ translation: { x: 1, y: 2 } });
    const status = collision.calcCollisionRepresentation(parentTrans);

    expect(status.box2ds).toEqual([...boxes1, ...boxes2]);
    expect(status.group).toEqual(group);
    expect(status.isExcess).toEqual(isExcess);

    expect(shape1.calcCollisionBox2ds).toBeCalledWith(parentTrans);
    expect(shape2.calcCollisionBox2ds).toBeCalledWith(parentTrans);
  });

  it("can disable collision", () => {
    const boxes1: readonly Box2d[] = [
      [0, 0, 1, 1],
      [1, 2, 3, 4],
    ];
    const shape1 = new collisionShapeMockClass(boxes1);
    const group = {
      mask: 0b0001,
      category: 0b0101,
    };
    const isExcess = true;

    const collision = new CollisionImpl();
    collision.init({
      shapes: [shape1],
      group,
      isExcess,
    });

    const parentTrans = Matrix.from({ translation: { x: 1, y: 2 } });

    collision.disable();
    const statusWhileDisabled = collision.calcCollisionRepresentation(
      parentTrans
    );
    expect(statusWhileDisabled.box2ds).toEqual([]);
    expect(shape1.calcCollisionBox2ds).not.toBeCalled();

    collision.enable();
    const statusWhileEnabled = collision.calcCollisionRepresentation(
      parentTrans
    );
    expect(statusWhileEnabled.box2ds).toEqual(boxes1);
  });
});
