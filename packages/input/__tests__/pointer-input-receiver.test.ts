import { PointerInputReceiver } from "../src";
import { Vector } from "trans-vector2d";

describe("@curtain-call/input.PointerInputReceiver", () => {
  it("emit event when notified from parent", () => {
    const receiver = new PointerInputReceiver();
    const ev = jest.fn();
    receiver.event.on("down", ev);

    const downPos = new Vector(1, 2);
    receiver.notifyDown(downPos);

    expect(ev).toBeCalledWith(downPos);
  });

  it("can modify event pos", () => {
    const modifier = jest.fn().mockImplementation((p: Vector) => p.mlt(2));
    const receiver = new PointerInputReceiver().setModifier(modifier);
    const ev = jest.fn();
    receiver.event.on("down", ev);

    const downPos = new Vector(1, 2);
    receiver.notifyDown(downPos);

    expect(ev).toBeCalledWith(new Vector(2, 4));
  });

  it("spread event to children", () => {
    const receiver = new PointerInputReceiver();
    jest.spyOn(receiver, "notifyDown");

    const parent = new PointerInputReceiver();
    parent.addChild(receiver);
    const downPos = new Vector(1, 2);
    parent.notifyDown(downPos);

    expect(receiver.notifyDown).toBeCalledWith(downPos);
  });

  it("can remove children", () => {
    const receiver = new PointerInputReceiver();
    jest.spyOn(receiver, "notifyDown");

    const parent = new PointerInputReceiver();
    parent.addChild(receiver).removeChild(receiver);
    const downPos = new Vector(1, 2);
    parent.notifyDown(downPos);

    expect(receiver.notifyDown).not.toBeCalled();
  });
});
