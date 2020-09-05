import { EventEmitter } from "eventemitter3";
import * as PIXI from "pixi.js";
import { World } from "@curtain-call/actor";

export const worldMockClass = jest.fn<World, []>(() => ({
  event: new EventEmitter<{
    updated: [number];
  }>(),
  pixiHead: new PIXI.Container(),
  pixiTail: new PIXI.Container(),
  setDrawAreaUpdater: jest.fn(),
  update: jest.fn(),
  addActor: jest.fn(),
  removeActor: jest.fn(),
  hasActor: jest.fn(),
  iterateActors: jest.fn(),
  addUpdatable: jest.fn(),
  removeUpdatable: jest.fn(),
  addPointerInputReceiver: jest.fn(),
  removePointerInputReceiver: jest.fn(),
  getPointerInputReceiver: jest.fn(),
  canvasPosToGamePos: jest.fn(),
  gamePosToCanvasPos: jest.fn(),
  setCoreArea: jest.fn(),
  calcPositionStatusWithCoreArea: jest.fn(),
}));
