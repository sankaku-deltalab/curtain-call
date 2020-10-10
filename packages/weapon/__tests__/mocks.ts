import { Matrix } from "trans-vector2d";
import * as PIXI from "pixi.js";
import { Camera } from "@curtain-call/actor";
import { transMockClass } from "@curtain-call/actor-test-mocks";
import { LocalConstantMover, RectCollisionShape, Weapon } from "../src";

export const cameraMockClass = jest.fn<Camera, []>(() => {
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

export const weaponMockClass = jest.fn<Weapon, []>(() => ({
  notifyAddedToActor: jest.fn(),
  update: jest.fn(),
  shouldBeRemovedFromWorld: jest.fn(),
  startFire: jest.fn(),
  isFiring: jest.fn(),
  stopFire: jest.fn(),
  forceStopFire: jest.fn(),
  calcTakingDamageMultiplier: jest.fn(),
}));
