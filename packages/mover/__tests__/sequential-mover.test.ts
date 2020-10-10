import { Vector, Matrix } from "trans-vector2d";
import { worldMockClass } from "@curtain-call/actor-test-mocks";
import { moverMockClass } from "./mock";
import { SequentialMover } from "../src";

describe("@curtain-call/mover.SequentialMover", () => {
  it("use multiple movers sequentially", () => {
    const mover1 = new moverMockClass(true, new Vector(1, 2));
    const mover2 = new moverMockClass(true, new Vector(3, 4));
    const mover = new SequentialMover().init([mover1, mover2]);

    expect(
      mover.update(new worldMockClass(), 1, Matrix.identity)
    ).toStrictEqual({
      done: false,
      newTrans: Matrix.translation({ x: 1, y: 2 }),
    });
    expect(
      mover.update(new worldMockClass(), 1, Matrix.identity)
    ).toStrictEqual({
      done: true,
      newTrans: Matrix.translation({ x: 3, y: 4 }),
    });
  });
});
