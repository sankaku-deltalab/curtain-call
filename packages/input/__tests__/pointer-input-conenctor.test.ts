import "reflect-metadata";
import { container } from "tsyringe";
import { Vector } from "trans-vector2d";
import { EventEmitter } from "eventemitter3";
import {
  PointerInput,
  PointerInputReceiver,
  PointerInputConnector,
  TapRecognizer,
} from "../src";
import { worldMockClass } from "./mock";

describe("@curtain-call/input.PointerInputConnector", () => {
  beforeEach(() => {
    container.register("EventEmitter", EventEmitter);
    container.register("Date", { useValue: new Date() });
    container.register("TapRecognizer", TapRecognizer);
  });

  afterEach(() => {
    container.reset();
  });

  it("notify down event to receiver when input was emit down event", () => {
    const input = new PointerInput();
    const receiver = new PointerInputReceiver();
    jest.spyOn(receiver, "notifyDown");

    const world = new worldMockClass();
    const _connector = new PointerInputConnector(world, input, receiver);
    const downPos = new Vector(1, 2);
    input.event.emit("down", downPos);

    expect(receiver.notifyDown).toBeCalledWith(world, downPos);
  });

  it("can destroy", () => {
    const input = new PointerInput();
    const receiver = new PointerInputReceiver();
    jest.spyOn(receiver, "notifyDown");

    const world = new worldMockClass();
    const connector = new PointerInputConnector(world, input, receiver);
    connector.destroy(input);
    const downPos = new Vector(1, 2);
    input.event.emit("down", downPos);

    expect(receiver.notifyDown).not.toBeCalled();
  });
});
