import { Matrix, Vector } from "trans-vector2d";
import { Mover } from "@curtain-call/mover";
import { Movers } from "../src";

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

describe("@curtain-call/actor.Movers", () => {
  it("can use multiple mover", () => {
    const mover1 = moverMock(false, new Vector(1, 2));
    const mover2 = moverMock(false, new Vector(3, 4));
    const movs = new Movers().add(mover1, mover2);

    const r = movs.update({}, 1, Matrix.identity);
    expect(r.newTrans).toEqual(Matrix.translation({ x: 4, y: 6 }));
  });

  it("can remove mover", () => {
    const mover1 = moverMock(false, new Vector(1, 2));
    const mover2 = moverMock(false, new Vector(3, 4));
    const movs = new Movers().add(mover1, mover2).remove(mover1, mover2);

    const r = movs.update({}, 1, Matrix.identity);
    expect(r.newTrans).toEqual(Matrix.identity);
  });
});
