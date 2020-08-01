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

  it.each`
    delta                   | expectedPos
    ${{ x: 1, y: 2 }}       | ${{ x: 4, y: 6 }}
    ${{ x: 5, y: 2 }}       | ${{ x: 5, y: 6 }}
    ${{ x: -100, y: -100 }} | ${{ x: 0, y: 1 }}
  `("can limit movement", ({ delta, expectedPos }) => {
    const receiver = new PointerInputReceiver();
    const mover = new PointerMover(receiver).setMovableArea(
      new Vector(0, 1),
      new Vector(5, 7)
    );

    const world = "world";
    receiver.notifyMove(world, Vector.zero, delta);

    expect(mover.update({}, 1, currentTrans)).toStrictEqual({
      done: false,
      newTrans: Matrix.from({
        ...currentTrans,
        e: expectedPos.x,
        f: expectedPos.y,
      }),
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
