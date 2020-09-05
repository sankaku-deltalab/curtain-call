import * as PIXI from "pixi.js";
import { Matrix } from "trans-vector2d";
import { Transformation } from "@curtain-call/actor";
import { containerMock, transMockClass } from "./mock";
import { Container } from "../src";

const createContainer = (): {
  pixiObj: PIXI.Container;
  trans: Transformation;
  container: Container;
} => {
  const pixiObj = containerMock();
  const trans = new transMockClass();
  const container = new Container(pixiObj, trans);
  return { pixiObj, trans, container };
};

describe("@curtain-call/display-object.Container", () => {
  it("update pixi container transform by Transformation", () => {
    const { pixiObj, trans, container } = createContainer();

    jest
      .spyOn(trans, "getGlobal")
      .mockReturnValue(Matrix.translation({ x: 1, y: 2 }));
    container.notifyPreDraw();

    expect(pixiObj.position.x).toBeCloseTo(1);
    expect(pixiObj.position.y).toBeCloseTo(2);
  });

  it("can add child", () => {
    const { pixiObj, container } = createContainer();

    const child = new PIXI.Sprite();
    container.addChild(child);

    expect(pixiObj.addChild).toBeCalledWith(child);
  });

  it("can remove child", () => {
    const { pixiObj, container } = createContainer();

    const child = new PIXI.Sprite();
    container.addChild(child);
    container.removeChild(child);

    expect(pixiObj.removeChild).toBeCalledWith(child);
  });
});
