import { Vector, Matrix } from "trans-vector2d";
import { Mover, ParallelMover } from "../src";

const moverMock = <T>(done: boolean, delta: Vector): Mover<T> => {
  const cls = jest.fn(() => ({
    update: jest
      .fn()
      .mockImplementation(
        (world: T, deltaSec: number, currentTrans: Matrix) => ({
          done,
          newTrans: currentTrans.translated(delta),
        })
      ),
  }));
  return new cls();
};

describe("@curtain-call/mover.ParallelMover", () => {
  it("use multiple movers parallel", () => {
    const mover1 = moverMock(true, new Vector(1, 2));
    const mover2 = moverMock(true, new Vector(3, 4));
    const mover = new ParallelMover().init([mover1, mover2]);

    expect(mover.update({}, 1, Matrix.identity)).toStrictEqual({
      done: true,
      newTrans: Matrix.translation({ x: 4, y: 6 }),
    });
  });
});
