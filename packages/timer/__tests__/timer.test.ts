import { EventEmitter } from "eventemitter3";
import * as PIXI from "pixi.js";
import { World } from "@curtain-call/actor";
import { Timer } from "../src";

const worldMockClass = jest.fn<World, []>(() => ({
  event: new EventEmitter<{
    updated: [number];
  }>(),
  pixiHead: new PIXI.Container(),
  pixiTail: new PIXI.Container(),
  getCamera: jest.fn(),
  setDrawAreaUpdater: jest.fn(),
  update: jest.fn(),
  addActor: jest.fn(),
  removeActor: jest.fn(),
  hasActor: jest.fn(),
  iterateActors: jest.fn(),
  addPointerInputReceiver: jest.fn(),
  removePointerInputReceiver: jest.fn(),
  getPointerInputReceiver: jest.fn(),
  canvasPosToGamePos: jest.fn(),
  gamePosToCanvasPos: jest.fn(),
  setCoreArea: jest.fn(),
  calcPositionStatusWithCoreArea: jest.fn(),
}));

describe("@curtain-call/timer", () => {
  it("call callback when updated", () => {
    const callback = jest.fn();
    const timer = new Timer(false, 30, callback);

    const world = new worldMockClass();
    timer.update(world, 10);
    timer.update(world, 10);
    timer.update(world, 20);

    expect(callback).toBeCalledWith(world, 10);
    expect(timer.isActive()).toBe(false);
  });

  it("can loop", () => {
    const callback = jest.fn();
    const timer = new Timer(true, 30, callback);

    const world = new worldMockClass();
    timer.update(world, 70);

    expect(callback).toBeCalledWith(world, 40);
    expect(callback).toBeCalledWith(world, 10);
    expect(timer.isActive()).toBe(true);
  });

  it("can deactivate", () => {
    const callback = jest.fn();
    const timer = new Timer(false, 30, callback).deactivate();
    expect(timer.isActive()).toBe(false);

    const world = new worldMockClass();
    timer.update(world, 40);

    expect(callback).not.toBeCalled();
  });

  it("inactive Timer should remove from world", () => {
    const callback = jest.fn();
    const timer = new Timer(false, 30, callback).deactivate();

    expect(timer.isActive()).toBe(false);
    expect(timer.shouldRemoveSelfFromWorld()).toBe(true);
  });
});
