import { Vector, Matrix } from "trans-vector2d";
import { worldMockClass } from "@curtain-call/actor-test-mocks";
import { moverMockClass } from "./mock";
import { ParallelMover } from "../src";

describe("@curtain-call/mover.ParallelMover", () => {
  it("use multiple movers parallel", () => {
    const mover1 = new moverMockClass(true, new Vector(1, 2));
    const mover2 = new moverMockClass(true, new Vector(3, 4));
    const mover = new ParallelMover().init([mover1, mover2]);

    expect(
      mover.update(new worldMockClass(), 1, Matrix.identity)
    ).toStrictEqual({
      done: true,
      newTrans: Matrix.translation({ x: 4, y: 6 }),
    });
  });
});
