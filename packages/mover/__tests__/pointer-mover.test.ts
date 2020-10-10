import { EventEmitter } from "eventemitter3";
import { Matrix, Vector } from "trans-vector2d";
import {
  PointerInputReceiver,
  PointerInputReceiverEvent,
} from "@curtain-call/actor";
import { worldMockClass } from "@curtain-call/actor-test-mocks";
import { PointerMover } from "../src";

const pointerInputReceiverMockClass = jest.fn<PointerInputReceiver, []>(() => ({
  event: new EventEmitter() as PointerInputReceiverEvent,
  setModifier: jest.fn().mockReturnThis(),
  addChild: jest.fn().mockReturnThis(),
  removeChild: jest.fn().mockReturnThis(),
  notifyDown: jest.fn(),
  notifyUp: jest.fn(),
  notifyTap: jest.fn(),
  notifyMove: jest.fn(),
}));

const createPointerMover = (): {
  receiver: PointerInputReceiver;
  pointerMover: PointerMover;
} => {
  const receiver = new pointerInputReceiverMockClass();
  const pointerMover = new PointerMover(receiver);
  return { receiver, pointerMover };
};

const currentTrans = Matrix.from({
  translation: new Vector(3, 4),
  rotation: 1,
});

describe("@curtain-call/mover.PointerMover", () => {
  it("move by pointer movement", () => {
    const { receiver, pointerMover } = createPointerMover();

    const world = new worldMockClass();
    const pointerDelta = new Vector(1, 2);
    receiver.event.emit("move", world, Vector.zero, Vector.from(pointerDelta));

    expect(pointerMover.update(world, 1, currentTrans)).toStrictEqual({
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
    const { receiver, pointerMover } = createPointerMover();
    pointerMover.setMovableArea(new Vector(0, 1), new Vector(5, 7));

    const world = new worldMockClass();
    receiver.event.emit("move", world, Vector.zero, Vector.from(delta));

    expect(pointerMover.update(world, 1, currentTrans)).toStrictEqual({
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
    const { receiver, pointerMover } = createPointerMover();
    pointerMover.setScale(moveScale);

    const world = new worldMockClass();
    const pointerDelta = new Vector(1, 2);
    receiver.event.emit("move", world, Vector.zero, Vector.from(pointerDelta));

    expect(pointerMover.update(world, 1, currentTrans)).toStrictEqual({
      done: false,
      newTrans: currentTrans.translated(pointerDelta.mlt(moveScale)),
    });
  });
});
