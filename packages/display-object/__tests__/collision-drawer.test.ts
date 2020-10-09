import * as PIXI from "pixi.js";
import { Collision, Box2d } from "@curtain-call/actor";
import { transMockClass } from "./mock";
import { CollisionDrawer } from "../src";

const collisionMockClass = jest.fn<Collision, [Box2d[]]>((boxes) => {
  const trans = new transMockClass();
  return {
    trans,
    addShape: jest.fn().mockReturnThis(),
    removeShape: jest.fn().mockReturnThis(),
    getBox2Ds: jest.fn().mockReturnValue(boxes),
    setIsHugeNumber: jest.fn().mockReturnThis(),
    isHugeNumber: jest.fn(),
    getGroup: jest.fn(),
    setGroup: jest.fn().mockReturnThis(),
    canCollideWith: jest.fn(),
    setEnable: jest.fn().mockReturnThis(),
    isEnabled: jest.fn(),
  };
});

const createGraphicsMock = (): PIXI.Graphics => {
  const graphics = new PIXI.Graphics();
  jest.spyOn(graphics, "clear");
  jest.spyOn(graphics, "lineStyle");
  jest.spyOn(graphics, "drawRect");
  return graphics;
};

describe("@curtain-call/display-object.CollisionDrawer", () => {
  it("draw collisions", () => {
    const graphics = createGraphicsMock();
    const drawer = new CollisionDrawer(graphics, new transMockClass());
    const boxes1: Box2d[] = [
      [0, 1, 2, 4],
      [2, 2, 4, 4],
    ];
    const collision1 = new collisionMockClass(boxes1);

    const boxes2: Box2d[] = [[3, 3, 5, 5]];
    const collision2 = new collisionMockClass(boxes2);

    drawer.updateDrawing([collision1, collision2]);

    expect(graphics.clear).toBeCalled();
    expect(graphics.lineStyle).toBeCalledWith(2, 0x209020);
    expect(graphics.drawRect).toBeCalledWith(0, 1, 2, 3);
    expect(graphics.drawRect).toBeCalledWith(2, 2, 2, 2);
    expect(graphics.drawRect).toBeCalledWith(3, 3, 2, 2);
  });

  it("has infinite z-index", () => {
    const graphics = createGraphicsMock();
    const _drawer = new CollisionDrawer(graphics, new transMockClass());

    expect(graphics.zIndex).toBe(Number.POSITIVE_INFINITY);
  });

  it("can enable pixi object", () => {
    const graphics = createGraphicsMock();
    const _drawer = new CollisionDrawer(
      graphics,
      new transMockClass()
    ).setEnable(true);

    expect(graphics.visible).toBe(true);
  });

  it("can disable pixi object", () => {
    const graphics = createGraphicsMock();
    const _drawer = new CollisionDrawer(
      graphics,
      new transMockClass()
    ).setEnable(false);

    expect(graphics.visible).toBe(false);
  });
});
