import { EventEmitter } from "eventemitter3";
import * as PIXI from "pixi.js";
import { World } from "@curtain-call/actor";
import { Asset } from "@curtain-call/asset";
import { Level } from "../src";

export const levelMockClass = jest.fn<Level, []>(() => ({
  load: jest.fn(),
  unload: jest.fn(),
  isLoaded: jest.fn(),
  activate: jest.fn(),
  deactivate: jest.fn(),
  isActive: jest.fn(),
  shouldRemoveSelfFromWorld: jest.fn().mockReturnValue(false),
  update: jest.fn(),
}));

export const assetMock = (): Asset => {
  const cls = jest.fn(() => ({
    load: jest.fn(),
    unload: jest.fn(),
    isLoaded: jest.fn(),
  }));
  return new cls();
};

export const worldMockClass = jest.fn<World, []>(() => ({
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
