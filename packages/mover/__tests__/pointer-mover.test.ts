import { Matrix, Vector } from "trans-vector2d";
import { PointerMover } from "../src";
import { PointerInputReceiver } from "@curtain-call/input";

const currentTrans = Matrix.from({
  translation: new Vector(3, 4),
  rotation: 1,
});

describe("@curtain-call/mover.PointerMover", () => {
  it("move by pointer movement", () => {
    const parent = new PointerInputReceiver();
    const mover = new PointerMover().setParent(parent);

    const pointerDelta = new Vector(1, 2);
    parent.event.emit("move", Vector.zero, pointerDelta);

    expect(mover.update({}, 1, currentTrans)).toStrictEqual({
      done: false,
      newTrans: currentTrans.translated(pointerDelta),
    });
  });

  it("can set movement scale", () => {
    const moveScale = 1.2;
    const parent = new PointerInputReceiver();
    const mover = new PointerMover().setParent(parent).setScale(moveScale);

    const pointerDelta = new Vector(1, 2);
    parent.event.emit("move", Vector.zero, pointerDelta);

    expect(mover.update({}, 1, currentTrans)).toStrictEqual({
      done: false,
      newTrans: currentTrans.translated(pointerDelta.mlt(moveScale)),
    });
  });

  it("can remove parent", () => {
    const parent = new PointerInputReceiver();
    const mover = new PointerMover().setParent(parent).removeParent(parent);

    const pointerDelta = new Vector(1, 2);
    parent.event.emit("move", Vector.zero, pointerDelta);

    expect(mover.update({}, 1, currentTrans)).toStrictEqual({
      done: false,
      newTrans: currentTrans,
    });
  });
});
