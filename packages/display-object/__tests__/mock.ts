import { EventEmitter } from "eventemitter3";
import * as PIXI from "pixi.js";
import { Matrix, Vector } from "trans-vector2d";
import {
  Transformation,
  PointerInputReceiver,
  Engine,
  CollisionShape,
  FiniteResource,
  Collision,
  World,
  PointerInputReceiverEvent,
} from "@curtain-call/actor";

export const containerMock = (): PIXI.Container => {
  const container = new PIXI.Container();
  jest.spyOn(container, "addChild");
  jest.spyOn(container, "removeChild");
  return container;
};

export const spriteMock = (): PIXI.Sprite => {
  return new PIXI.Sprite();
};

export const transMockClass = jest.fn<Transformation, []>(() => ({
  setLocal: jest.fn(),
  getLocal: jest.fn().mockReturnValue(Matrix.identity),
  getGlobal: jest.fn().mockReturnValue(Matrix.identity),
  calcRelativeFrom: jest.fn(),
  attachChild: jest.fn(),
  detachChild: jest.fn(),
  notifyAttachedTo: jest.fn(),
  notifyDetachedFromParent: jest.fn(),
  notifyParentUpdated: jest.fn(),
  getParent: jest.fn(),
}));

export const pointerInputReceiverMockClass = jest.fn<PointerInputReceiver, []>(
  () => ({
    event: new EventEmitter() as PointerInputReceiverEvent,
    setModifier: jest.fn().mockReturnThis(),
    addChild: jest.fn().mockReturnThis(),
    removeChild: jest.fn().mockReturnThis(),
    notifyDown: jest.fn(),
    notifyUp: jest.fn(),
    notifyTap: jest.fn(),
    notifyMove: jest.fn(),
  })
);

export const healthMockClass = jest.fn<FiniteResource, []>(() => ({
  init: jest.fn().mockReturnThis(),
  value: jest.fn(),
  max: jest.fn(),
  add: jest.fn(),
  sub: jest.fn(),
}));

export const collisionMockClass = jest.fn<Collision, []>(() => ({
  trans: new transMockClass(),
  addShape: jest.fn(),
  removeShape: jest.fn(),
  getBox2Ds: jest.fn(),
  setIsHugeNumber: jest.fn(),
  isHugeNumber: jest.fn(),
  getGroup: jest.fn(),
  setGroup: jest.fn(),
  canCollideWith: jest.fn(),
  setEnable: jest.fn(),
  isEnabled: jest.fn(),
}));

export const engineMockClass = jest.fn<Engine, []>(() => ({
  event: new EventEmitter<{}>(),
  canvasSize: jest.fn().mockReturnValue(new Vector(2, 2)),
  addWorld: jest.fn().mockReturnThis(),
  removeWorld: jest.fn().mockReturnThis(),
  destroy: jest.fn(),
}));

export const collisionShapeMock = jest.fn<CollisionShape, []>(() => ({
  trans: new transMockClass(),
  getBox2Ds: jest.fn(),
}));

export const worldMockClass = jest.fn<World, []>(() => ({
  event: new EventEmitter<{
    updated: [number];
  }>(),
  pixiHead: containerMock(),
  pixiTail: containerMock(),
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
