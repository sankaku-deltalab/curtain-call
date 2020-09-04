import * as PIXI from "pixi.js";
import { Matrix } from "trans-vector2d";
import { Transformation } from "@curtain-call/actor";
import { RectArea } from "@curtain-call/world";
import { Camera } from "../src";

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

export const rectAreaMockClass = jest.fn<RectArea, []>(() => ({
  trans: new transMockClass(),
  init: jest.fn().mockReturnThis(),
  calcPositionStatus: jest.fn(),
}));

export const createCamera = (): {
  trans: Transformation;
  pixiHead: PIXI.Container;
  pixiTail: PIXI.Container;
  visibleArea: RectArea;
  camera: Camera;
} => {
  const trans = new transMockClass();
  const pixiHead = containerMock();
  const pixiTail = containerMock();
  const visibleArea = new rectAreaMockClass();
  const camera = new Camera(trans, pixiHead, pixiTail, visibleArea);
  return {
    trans,
    pixiHead,
    pixiTail,
    visibleArea,
    camera,
  };
};
