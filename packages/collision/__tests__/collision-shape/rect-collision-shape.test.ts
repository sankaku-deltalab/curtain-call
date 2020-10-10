import { Vector, Matrix } from "trans-vector2d";
import { transMockClass } from "@curtain-call/actor-test-mocks";
import { RectCollisionShape, diContainer } from "../../src";

describe("@curtain-call/collision.RectCollisionShape", () => {
  beforeAll(() => {
    diContainer.register("Transformation", { useClass: transMockClass });
  });

  afterAll(() => {
    diContainer.clearInstances();
  });

  it("can set size", () => {
    const shape = new RectCollisionShape();

    expect(() => shape.setSize(Vector.zero)).not.toThrowError();
  });

  it("deal one box", () => {
    const shape = new RectCollisionShape();
    shape.setSize({ x: 1, y: 2 });
    jest
      .spyOn(shape.trans, "getGlobal")
      .mockReturnValue(
        Matrix.from({ translation: { x: 3, y: 4 }, scale: { x: 5, y: 6 } })
      );

    const expectedNW: [number, number] = [3 - (1 * 5) / 2, 4 - (2 * 6) / 2];
    const expectedSE: [number, number] = [3 + (1 * 5) / 2, 4 + (2 * 6) / 2];
    expect(shape.getBox2Ds()).toEqual([
      [expectedNW[0], expectedNW[1], expectedSE[0], expectedSE[1]],
    ]);
  });
});
