import * as PIXI from "pixi.js";
import { Matrix } from "trans-vector2d";
import { Transformation } from "@curtain-call/util";
import { Container } from "../src";

const createContainer = <T>(): {
  pixiContainer: PIXI.Container;
  container: Container<T>;
} => {
  const pixiContainer = new PIXI.Container();
  jest.spyOn(pixiContainer, "addChild");
  jest.spyOn(pixiContainer, "removeChild");
  const container = new Container(pixiContainer);
  return { pixiContainer, container };
};

describe("@curtain-call/display-object.Container", () => {
  it("has Transformation", () => {
    const container = new Container();
    expect(container.trans).toBeInstanceOf(Transformation);
  });

  it("update container transform by Transformation", () => {
    const { pixiContainer, container } = createContainer();

    container.trans.setLocal(Matrix.translation({ x: 1, y: 2 }));
    container.update();

    expect(pixiContainer.position.x).toBeCloseTo(1);
    expect(pixiContainer.position.y).toBeCloseTo(2);
  });

  it("can add child", () => {
    const { pixiContainer, container } = createContainer();

    const child = new PIXI.Sprite();
    container.addChild(child);

    expect(pixiContainer.addChild).toBeCalledWith(child);
  });

  it("can remove child", () => {
    const { pixiContainer, container } = createContainer();

    const child = new PIXI.Sprite();
    container.addChild(child);
    container.removeChild(child);

    expect(pixiContainer.removeChild).toBeCalledWith(child);
  });
});
