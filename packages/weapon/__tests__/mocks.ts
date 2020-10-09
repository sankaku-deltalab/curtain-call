import EventEmitter from "eventemitter3";
import { Matrix } from "trans-vector2d";
import * as PIXI from "pixi.js";
import {
  IActor,
  Transformation,
  FiniteResource,
  Collision,
  World,
  Camera,
  PositionInAreaStatus,
  DamageType,
} from "@curtain-call/actor";
import { LocalConstantMover, RectCollisionShape, Weapon } from "../src";

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
    setEnableCollisionDrawing: jest.fn(),
  };
});

export const actorInterfaceMockClass = jest.fn<IActor, []>(() => {
  const event = new EventEmitter<{
    // world
    addedToWorld: [World];
    removedFromWorld: [World];
    updated: [World, number];
    // collision
    overlapped: [World, Set<IActor>];
    // health
    takenDamage: [World, number, IActor, DamageType];
    dead: [World, IActor, DamageType];
    beHealed: [World, number];
    // damage dealer
    dealDamage: [World, number, IActor, DamageType];
    killed: [World, IActor, DamageType];
  }>();
  return {
    event,
    getExtensions: jest.fn(),
    getOneExtension: jest.fn(),
    addExtension: jest.fn().mockReturnThis(),
    addTimer: jest.fn().mockReturnThis(),
    removeTimer: jest.fn().mockReturnThis(),
    moveTo: jest.fn().mockReturnThis(),
    rotateTo: jest.fn().mockReturnThis(),
    setLocalTransform: jest.fn().mockReturnThis(),
    swapLocalTransform: jest.fn().mockReturnThis(),
    getTransformation: jest.fn(),
    attachActor: jest.fn().mockReturnThis(),
    attachTransformation: jest.fn().mockReturnThis(),
    detachActor: jest.fn().mockReturnThis(),
    detachTransformation: jest.fn().mockReturnThis(),
    addMover: jest.fn().mockReturnThis(),
    removeMover: jest.fn().mockReturnThis(),
    reserveRemovingSelfFromWorld: jest.fn().mockReturnThis(),
    cancelRemovingSelfFromWorld: jest.fn().mockReturnThis(),
    shouldBeRemovedFromWorld: jest.fn(),
    notifyAddedToWorld: jest.fn(),
    notifyRemovedFromWorld: jest.fn(),
    update: jest.fn(),
    setLifeTime: jest.fn().mockReturnThis(),
    addCollisionShape: jest.fn().mockReturnThis(),
    removeCollisionShape: jest.fn().mockReturnThis(),
    setCollisionAsHugeNumber: jest.fn().mockReturnThis(),
    setCollisionGroup: jest.fn().mockReturnThis(),
    setCollisionEnable: jest.fn().mockReturnThis(),
    getCollision: jest.fn(),
    notifyOverlappedWith: jest.fn(),
    addDisplayObject: jest.fn().mockReturnThis(),
    removeDisplayObject: jest.fn().mockReturnThis(),
    iterateDisplayObject: jest.fn(),
    initHealth: jest.fn().mockReturnThis(),
    health: jest.fn(),
    healthMax: jest.fn(),
    isDead: jest.fn(),
    takeDamage: jest.fn(),
    killSelf: jest.fn(),
    heal: jest.fn(),
    dealDamage: jest.fn(),
    killOther: jest.fn(),
    notifyDealtDamage: jest.fn(),
    notifyKilled: jest.fn(),
    setTeam: jest.fn().mockReturnThis(),
    getTeam: jest.fn(),
    setRole: jest.fn().mockReturnThis(),
    getRole: jest.fn(),
    addSubActor: jest.fn().mockReturnThis(),
    removeSubActor: jest.fn().mockReturnThis(),
    hasSubActor: jest.fn(),
    getOwnerActor: jest.fn(),
    getSubActors: jest.fn(),
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
}));

export const weaponMock = (): Weapon => {
  return new weaponMockClass();
};
