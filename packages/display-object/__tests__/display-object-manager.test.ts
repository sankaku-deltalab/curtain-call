import * as PIXI from "pixi.js";
import { DisplayObjectManager, Sprite } from "../src";

const pixiConteinerMock = (): PIXI.Container => {
  const pixiContainer = new PIXI.Container();
  jest.spyOn(pixiContainer, "addChild");
  jest.spyOn(pixiContainer, "removeChild");
  return pixiContainer;
};

describe("@curtain-call/display-object.DisplayObjectManager", () => {
  it("can construct without arguments", () => {
    expect(() => new DisplayObjectManager()).not.toThrowError();
  });

  it("can add pixi sprite to pixi container", () => {
    const pixiContainer = pixiConteinerMock();
    const manager = new DisplayObjectManager(pixiContainer);

    const sprite = new Sprite();
    manager.updatePixiObjects([sprite]);

    expect(pixiContainer.addChild).toBeCalledWith(sprite.pixiObj);
  });

  it("do not add pixi sprite twice", () => {
    const pixiContainer = pixiConteinerMock();
    const manager = new DisplayObjectManager(pixiContainer);

    const sprite = new Sprite();
    manager.updatePixiObjects([sprite]);
    manager.updatePixiObjects([sprite]);

    expect(pixiContainer.addChild).toBeCalledTimes(1);
  });

  it("can remove pixi sprite from pixi container", () => {
    const pixiContainer = pixiConteinerMock();
    const manager = new DisplayObjectManager(pixiContainer);

    const sprite = new Sprite();
    manager.updatePixiObjects([sprite]);
    manager.updatePixiObjects([]);

    expect(pixiContainer.children).toEqual([]);
  });

  it("do not update display object", () => {
    const pixiContainer = pixiConteinerMock();
    const manager = new DisplayObjectManager(pixiContainer);

    const sprite = new Sprite();
    jest.spyOn(sprite, "updatePixiObject");
    manager.updatePixiObjects([sprite]);

    expect(sprite.updatePixiObject).not.toBeCalled();
  });
});
