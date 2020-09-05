import { Matrix, Vector } from "trans-vector2d";
import { worldMockClass } from "./mock";
import { RelativeMover } from "../src";

const currentTrans = Matrix.from({
  translation: new Vector(3, 4),
  rotation: Math.PI / 2,
});

describe("@curtain-call/mover.RelativeMover", () => {
  it("deal global translation from route", () => {
    const delta = Matrix.from({
      translation: { x: 1, y: 0 },
      rotation: Math.PI / 2,
    });
    const mover = new RelativeMover().setDelta(delta);

    const r = mover.update(new worldMockClass(), 0.5, currentTrans);

    const rc = r.newTrans.decompose();
    expect(r.done).toBe(false);
    expect(rc.translation).toEqual(new Vector(3, 4.5));
    expect(rc.rotation).toBeCloseTo(Math.PI * (3 / 4));
    expect(rc.scale).toEqual(Vector.one);
  });
});
