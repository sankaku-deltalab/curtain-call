import { Matrix, Vector } from "trans-vector2d";
import { MoveRoute, RouteMover } from "../src";

const routeMock = <T>(done: boolean, x: number, y: number): MoveRoute<T> => {
  const cls = jest.fn(() => ({
    getTransformationAt: jest
      .fn()
      .mockReturnValue({ done, position: new Vector(x, y) }),
  }));
  return new cls();
};

const currentTrans = Matrix.from({
  translation: new Vector(3, 4),
  rotation: 1,
});

describe("@curtain-call/mover.RouteMover", () => {
  it("deal global translation from route", () => {
    const route = routeMock(false, 1, 2);
    const mover = new RouteMover();

    mover.start(route);

    const scene = jest.fn();
    const deltaSec = 123;
    const expectedTrans = Matrix.from({
      translation: new Vector(4, 6),
      rotation: 1,
    });
    expect(mover.update(scene, deltaSec, currentTrans)).toStrictEqual({
      done: false,
      newTrans: expectedTrans,
    });
  });

  it("can abort route", () => {
    const route = routeMock(false, 1, 2);
    const mover = new RouteMover();

    mover.start(route);
    mover.abort();

    const scene = jest.fn();
    const deltaSec = 123;
    expect(mover.update(scene, deltaSec, currentTrans)).toStrictEqual({
      done: true,
      newTrans: currentTrans,
    });
  });
});
