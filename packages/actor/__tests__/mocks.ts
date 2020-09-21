import { EventEmitter } from "eventemitter3";
import { Matrix, Vector } from "trans-vector2d";
import * as PIXI from "pixi.js";
import {
  Actor,
  Transformation,
  FiniteResource,
  Collision,
  DisplayObject,
  CollisionShape,
  World,
  DamageType,
  Mover,
  IActor,
  ActorController,
} from "../src";

export const moverMockClass = jest.fn<Mover, [boolean, Vector]>(
  (done: boolean, delta: Vector) => ({
    update: jest
      .fn()
      .mockImplementation(
        (world: World, deltaSec: number, currentTrans: Matrix) => ({
          done,
          newTrans: currentTrans.translated(delta.mlt(deltaSec)),
        })
      ),
  })
);

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

export const collisionMockClass = jest.fn<Collision, [Transformation]>(
  (trans: Transformation) => ({
    trans,
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
  })
);

export const createActor = (): {
  actor: IActor;
  trans: Transformation;
  health: FiniteResource;
  collisionTrans: Transformation;
  collision: Collision;
} => {
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
  const trans = new transMockClass();
  const health = new healthMockClass();
  const collisionTrans = new transMockClass();
  const collision = new collisionMockClass(collisionTrans);
  const actor = new Actor(event, trans, health, collision);
  return {
    actor,
    trans,
    health,
    collisionTrans,
    collision,
  };
};

export const collisionShapeMock = jest.fn<CollisionShape, []>(() => ({
  trans: new transMockClass(),
  getBox2Ds: jest.fn(),
}));

export const worldMock = jest.fn<World, []>(() => ({
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

export const displayObjectMock = jest.fn<DisplayObject, []>(() => ({
  pixiObj: new PIXI.Container(),
  trans: new transMockClass(),
  update: jest.fn(),
}));

export const controllerMockClass = jest.fn<ActorController, []>(() => ({
  getActor: jest.fn(),
  notifyUsedBy: jest.fn(),
  update: jest.fn(),
  shouldBeRemovedFromWorld: jest.fn(),
}));

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
    getController: jest.fn(),
    setController: jest.fn().mockReturnThis(),
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
