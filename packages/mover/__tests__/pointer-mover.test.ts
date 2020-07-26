import { Matrix, Vector } from "trans-vector2d";
import { PointerMover } from "../src";
import { PointerInputReceiver } from "@curtain-call/input";

const currentTrans = Matrix.from({
  translation: new Vector(3, 4),
  rotation: 1,
});

describe("@curtain-call/mover.PointerMover", () => {
  it("move by pointer movement", () => {
    const mover = new PointerMover();
    const parent = new PointerInputReceiver().addChild(
      mover.getInputReceiver()
    );

    const world = "world";
    const pointerDelta = new Vector(1, 2);
    parent.notifyMove(world, Vector.zero, pointerDelta);

    expect(mover.update({}, 1, currentTrans)).toStrictEqual({
      done: false,
      newTrans: currentTrans.translated(pointerDelta),
    });
  });

  it("can set movement scale", () => {
    const moveScale = 1.2;
    const mover = new PointerMover().setScale(moveScale);
    const parent = new PointerInputReceiver().addChild(
      mover.getInputReceiver()
    );

    const world = "world";
    const pointerDelta = new Vector(1, 2);
    parent.notifyMove(world, Vector.zero, pointerDelta);

    expect(mover.update({}, 1, currentTrans)).toStrictEqual({
      done: false,
      newTrans: currentTrans.translated(pointerDelta.mlt(moveScale)),
    });
  });
});
