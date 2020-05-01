import { Vector, Matrix } from "trans-vector2d";
import { RectCollisionShape } from "../src";

describe("@curtain-call/collision.RectCollisionShape", () => {
  it("can set size", () => {
    const shape = new RectCollisionShape();

    expect(() => shape.setSize(Vector.zero)).not.toThrowError();
  });

  it("deal one box", () => {
    const shape = new RectCollisionShape();
    shape.setSize({ x: 1, y: 2 });
    shape.trans.setLocal(
      Matrix.scaling({ x: 5, y: 6 }).translated({ x: 3, y: 4 })
    );

    const expectedNW: [number, number] = [3 - (1 * 5) / 2, 4 - (2 * 6) / 2];
    const expectedSE: [number, number] = [3 + (1 * 5) / 2, 4 + (2 * 6) / 2];
    expect(shape.getBox2Ds()).toEqual([
      [expectedNW[0], expectedNW[1], expectedSE[0], expectedSE[1]],
    ]);
  });
});
