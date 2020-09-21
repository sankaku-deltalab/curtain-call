import EventEmitter from "eventemitter3";
import { Matrix } from "trans-vector2d";
import * as PIXI from "pixi.js";
import {
  Transformation,
  FiniteResource,
  Collision,
  World,
  Camera,
  PositionInAreaStatus,
} from "@curtain-call/actor";
import { LocalConstantMover, RectCollisionShape, Weapon } from "../src";

export const transMockClass = jest.fn<Transformation, []>(() => ({
  setLocal: jest.fn(),
  getLocal: jest.fn().mockReturnValue(Matrix.identity),
  getGlobal: jest.fn().mockReturnValue(Matrix.identity),
  calcRelative: jest.fn(),
  attachChild: jest.fn(),
  detachChild: jest.fn(),
}));

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

const cameraMockClass = jest.fn<Camera, []>(() => {
  return {
    trans: new transMockClass(),
    pixiHead: new PIXI.Container(),
    pixiTail: new PIXI.Container(),
    update: jest.fn(),
    setCameraResolution: jest.fn().mockReturnThis(),
    moveTo: jest.fn().mockReturnThis(),
    zoomTo: jest.fn().mockReturnThis(),
    rotateTo: jest.fn().mockReturnThis(),
    calcVisibilityStatus: jest.fn(),
  };
});

export const worldMockClass = jest.fn<World, []>(() => {
  const camera = new cameraMockClass();
  return {
    event: new EventEmitter<{
      updated: [number];
    }>(),
    pixiHead: new PIXI.Container(),
    pixiTail: new PIXI.Container(),
    getCamera: jest.fn().mockReturnValue(camera),
    setDrawAreaUpdater: jest.fn(),
    update: jest.fn(),
    addActor: jest.fn().mockReturnThis(),
    removeActor: jest.fn().mockReturnThis(),
    hasActor: jest.fn(),
    iterateActors: jest.fn(),
    addPointerInputReceiver: jest.fn(),
    removePointerInputReceiver: jest.fn(),
    getPointerInputReceiver: jest.fn(),
    canvasPosToGamePos: jest.fn(),
    gamePosToCanvasPos: jest.fn(),
    setCoreArea: jest.fn(),
    calcPositionStatusWithCoreArea: jest
      .fn()
      .mockReturnValue(PositionInAreaStatus),
  };
});

export const localConstantMoverMockClass = jest.fn<LocalConstantMover, []>(
  () => ({
    update: jest.fn().mockReturnValue({
      done: false,
      newTrans: Matrix.identity,
    }),
    setVelocity: jest.fn(),
  })
);

export const rectCollisionShapeMockClass = jest.fn<RectCollisionShape, []>(
  () => ({
    trans: new transMockClass(),
    getBox2Ds: jest.fn(),
    setSize: jest.fn(),
  })
);

export class WeaponMock extends Weapon {
  /**
   * Start firing.
   *
   * @param world World.
   */
  startFire(_world: World): void {
    // do nothing
  }

  /**
   * Is firing now.
   *
   * @returns Is firing.
   */
  isFiring(): boolean {
    return false;
  }

  /**
   * Request stop firing.
   */
  stopFire(): void {
    // do nothing
  }

  /**
   * Stop firing process immediately.
   */
  forceStopFire(): void {
    // do nothing
  }
}

export const weaponMock = (): WeaponMock => {
  const weapon = new WeaponMock();
  jest.spyOn(weapon, "startFire");
  jest.spyOn(weapon, "isFiring");
  jest.spyOn(weapon, "stopFire");
  jest.spyOn(weapon, "forceStopFire");
  jest.spyOn(weapon, "update");
  return weapon;
};
