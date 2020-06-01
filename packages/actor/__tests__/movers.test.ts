import { Matrix, Vector } from "trans-vector2d";
import { Movers } from "../src";
import { moverMock } from "./mock";

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
