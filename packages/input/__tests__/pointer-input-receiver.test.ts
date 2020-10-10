import "reflect-metadata";
import { container } from "tsyringe";
import { Vector } from "trans-vector2d";
import { EventEmitter } from "eventemitter3";
import { worldMockClass } from "@curtain-call/actor-test-mocks";
import { PointerInputReceiver } from "../src";

describe("@curtain-call/input.PointerInputReceiver", () => {
  beforeEach(() => {
    container.register("EventEmitter", EventEmitter);
  });

  afterEach(() => {
    container.reset();
  });

  it("emit event when notified from parent", () => {
    const receiver = new PointerInputReceiver();
    const ev = jest.fn();
    receiver.event.on("down", ev);

    const world = new worldMockClass();
    const downPos = new Vector(1, 2);
    receiver.notifyDown(world, downPos);

    expect(ev).toBeCalledWith(world, downPos);
  });

  it("can modify event pos", () => {
    const modifier = jest.fn().mockImplementation((p: Vector) => p.mlt(2));
    const receiver = new PointerInputReceiver().setModifier(modifier);
    const ev = jest.fn();
    receiver.event.on("down", ev);

    const world = new worldMockClass();
    const downPos = new Vector(1, 2);
    receiver.notifyDown(world, downPos);

    expect(ev).toBeCalledWith(world, new Vector(2, 4));
  });

  it("spread event to children", () => {
    const receiver = new PointerInputReceiver();
    jest.spyOn(receiver, "notifyDown");

    const parent = new PointerInputReceiver();
    parent.addChild(receiver);
    const world = new worldMockClass();
    const downPos = new Vector(1, 2);
    parent.notifyDown(world, downPos);

    expect(receiver.notifyDown).toBeCalledWith(world, downPos);
  });

  it("can remove children", () => {
    const receiver = new PointerInputReceiver();
    jest.spyOn(receiver, "notifyDown");

    const parent = new PointerInputReceiver();
    parent.addChild(receiver).removeChild(receiver);
    const world = new worldMockClass();
    const downPos = new Vector(1, 2);
    parent.notifyDown(world, downPos);

    expect(receiver.notifyDown).not.toBeCalled();
  });
});
