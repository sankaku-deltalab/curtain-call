import { DisplayObject } from "@curtain-call/actor";
import { containerMock, transMockClass } from "./mock";
import { DisplayObjectManager } from "../src";

export const displayObjectMockClass = jest.fn<DisplayObject, []>(() => ({
  pixiObj: containerMock(),
  trans: new transMockClass(),
  notifyPreDraw: jest.fn(),
}));

describe("@curtain-call/display-object.DisplayObjectManager", () => {
  it("can construct without arguments", () => {
    expect(() => new DisplayObjectManager()).not.toThrowError();
  });

  it("can add pixi sprite to pixi container", () => {
    const pixiContainer = containerMock();
    const manager = new DisplayObjectManager(pixiContainer);

    const sprite = new displayObjectMockClass();
    manager.updatePixiObjects([sprite]);

    expect(pixiContainer.addChild).toBeCalledWith(sprite.pixiObj);
  });

  it("do not add pixi sprite twice", () => {
    const pixiContainer = containerMock();
    const manager = new DisplayObjectManager(pixiContainer);

    const sprite = new displayObjectMockClass();
    manager.updatePixiObjects([sprite]);
    manager.updatePixiObjects([sprite]);

    expect(pixiContainer.addChild).toBeCalledTimes(1);
  });

  it("can remove pixi sprite from pixi container", () => {
    const pixiContainer = containerMock();
    const manager = new DisplayObjectManager(pixiContainer);

    const sprite = new displayObjectMockClass();
    manager.updatePixiObjects([sprite]);
    manager.updatePixiObjects([]);

    expect(pixiContainer.children).toEqual([]);
  });

  it("do not update display object", () => {
    const pixiContainer = containerMock();
    const manager = new DisplayObjectManager(pixiContainer);

    const sprite = new displayObjectMockClass();
    jest.spyOn(sprite, "notifyPreDraw");
    manager.updatePixiObjects([sprite]);

    expect(sprite.notifyPreDraw).not.toBeCalled();
  });
});
