import { EventEmitter } from "eventemitter3";
import * as PIXI from "pixi.js";
import { Vector } from "trans-vector2d";
import {
  Transformation,
  PointerInputReceiver,
  Engine,
  Camera,
  PointerInputReceiverEvent,
} from "@curtain-call/actor";
import { transMockClass } from "@curtain-call/actor-test-mocks";
import {
  World,
  DisplayObjectManager,
  RectArea,
  OverlapChecker,
  CollisionDrawer,
} from "../src";

const containerMock = (): PIXI.Container => {
  const container = new PIXI.Container();
  jest.spyOn(container, "addChild");
  jest.spyOn(container, "removeChild");
  return container;
};

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

const collisionDrawerMockClass = jest.fn<CollisionDrawer, []>(() => ({
  pixiObj: containerMock(),
  trans: new transMockClass(),
  update: jest.fn(),
  setEnable: jest.fn(),
  updateDrawing: jest.fn(),
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
  collisionDrawer: CollisionDrawer;
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
  const collisionDrawer = new collisionDrawerMockClass();
  const pointerInput = new pointerInputReceiverMockClass();
  const coreArea = new reactAreaMockClass();
  const overlapChecker = new overlapCheckerMockClass();
  const backgroundTrans = new transMockClass();
  const world = new World(
    pixiHead,
    pixiTail,
    camera,
    displayObjectManager,
    collisionDrawer,
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
    collisionDrawer,
    pointerInput,
    coreArea,
    overlapChecker,
    backgroundTrans,
  };
};

export const engineMockClass = jest.fn<Engine, []>(() => ({
  event: new EventEmitter<{}>(),
  canvasSize: jest.fn().mockReturnValue(new Vector(2, 2)),
  addWorld: jest.fn().mockReturnThis(),
  removeWorld: jest.fn().mockReturnThis(),
  destroy: jest.fn(),
}));
