import { EventEmitter } from "eventemitter3";
import * as PIXI from "pixi.js";
import { Matrix, Vector } from "trans-vector2d";
import {
  Transformation,
  PointerInputReceiver,
  Engine,
  DisplayObject,
  CollisionShape,
  FiniteResource,
  Collision,
  Camera,
} from "@curtain-call/actor";
import { World, DisplayObjectManager, RectArea, OverlapChecker } from "../src";

const containerMock = (): PIXI.Container => {
  const container = new PIXI.Container();
  jest.spyOn(container, "addChild");
  jest.spyOn(container, "removeChild");
  return container;
};

export const transMockClass = jest.fn<Transformation, []>(() => ({
  setLocal: jest.fn(),
  getLocal: jest.fn().mockReturnValue(Matrix.identity),
  getGlobal: jest.fn().mockReturnValue(Matrix.identity),
  calcRelative: jest.fn(),
  attachChild: jest.fn(),
  detachChild: jest.fn(),
}));

const cameraMockClass = jest.fn<Camera, []>(() => {
  const pixiHead = containerMock();
  const pixiTail = containerMock();
  pixiHead.addChild(pixiTail);
  return {
    trans: new transMockClass(),
    pixiHead,
    pixiTail,
    update: jest.fn(),
    setCameraResolution: jest.fn().mockReturnThis(),
    moveTo: jest.fn().mockReturnThis(),
    zoomTo: jest.fn().mockReturnThis(),
    rotateTo: jest.fn().mockReturnThis(),
    calcVisibilityStatus: jest.fn(),
  };
});

const displayObjectManagerMockClass = jest.fn<DisplayObjectManager, []>(() => ({
  container: containerMock(),
  updatePixiObjects: jest.fn(),
}));

export const pointerInputReceiverMockClass = jest.fn<PointerInputReceiver, []>(
  () => ({
    event: new EventEmitter(),
    setModifier: jest.fn().mockReturnThis(),
    addChild: jest.fn().mockReturnThis(),
    removeChild: jest.fn().mockReturnThis(),
    notifyDown: jest.fn(),
    notifyUp: jest.fn(),
    notifyTap: jest.fn(),
    notifyMove: jest.fn(),
  })
);

const reactAreaMockClass = jest.fn<RectArea, []>(() => ({
  trans: new transMockClass(),
  init: jest.fn().mockReturnThis(),
  calcPositionStatus: jest.fn(),
}));

const overlapCheckerMockClass = jest.fn<OverlapChecker, []>(() => ({
  checkOverlap: jest.fn().mockReturnValue(new Map()),
}));

export const createWorld = (): {
  world: World;
  pixiHead: PIXI.Container;
  pixiTail: PIXI.Container;
  camera: Camera;
  displayObjectManager: DisplayObjectManager;
  pointerInput: PointerInputReceiver;
  coreArea: RectArea;
  overlapChecker: OverlapChecker;
  backgroundTrans: Transformation;
} => {
  const pixiHead = containerMock();
  const enginePixiContainer = containerMock();
  enginePixiContainer.addChild(pixiHead);
  const pixiTail = containerMock();
  const camera = new cameraMockClass();
  const displayObjectManager = new displayObjectManagerMockClass();
  const pointerInput = new pointerInputReceiverMockClass();
  const coreArea = new reactAreaMockClass();
  const overlapChecker = new overlapCheckerMockClass();
  const backgroundTrans = new transMockClass();
  const world = new World(
    pixiHead,
    pixiTail,
    camera,
    displayObjectManager,
    pointerInput,
    coreArea,
    overlapChecker,
    backgroundTrans
  );
  return {
    world,
    pixiHead,
    pixiTail,
    camera,
    displayObjectManager,
    pointerInput,
    coreArea,
    overlapChecker,
    backgroundTrans,
  };
};

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
  event: new EventEmitter(),
  canvasSize: jest.fn().mockReturnValue(new Vector(2, 2)),
  addWorld: jest.fn().mockReturnThis(),
  removeWorld: jest.fn().mockReturnThis(),
  destroy: jest.fn(),
}));

export const displayObjectMockClass = jest.fn<DisplayObject, []>(() => ({
  pixiObj: containerMock(),
  trans: new transMockClass(),
  update: jest.fn(),
}));

export const collisionShapeMock = jest.fn<CollisionShape, []>(() => ({
  trans: new transMockClass(),
  getBox2Ds: jest.fn(),
}));
