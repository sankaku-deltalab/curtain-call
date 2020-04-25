import * as PIXI from "pixi.js";
import { DisplayObjectContainer, Sprite } from "../src";

const pixiConteinerMock = (): PIXI.Container => {
  const pixiContainer = new PIXI.Container();
  jest.spyOn(pixiContainer, "addChild");
  jest.spyOn(pixiContainer, "removeChild");
  return pixiContainer;
};

describe("@curtain-call/display-object.DisplayObjectContainer", () => {
  describe("can add Sprite", () => {
    it("by function", () => {
      const pixiContainer = pixiConteinerMock();
      const container = new DisplayObjectContainer(pixiContainer);

      const sprite = new Sprite();
      expect(() => container.add(sprite)).not.toThrowError();
    });

    it("and contain pixi sprite to container", () => {
      const pixiContainer = pixiConteinerMock();
      const container = new DisplayObjectContainer(pixiContainer);

      const sprite = new Sprite();
      container.add(sprite);

      expect(pixiContainer.addChild).toBeCalledWith(sprite.pixiObj);
    });

    it("but throw error when add added sprite", () => {
      const pixiContainer = pixiConteinerMock();
      const container = new DisplayObjectContainer(pixiContainer);

      const sprite = new Sprite();
      container.add(sprite);

      expect(() => container.add(sprite)).toThrowError();
    });

    it("and can remove added child with sprite", () => {
      const pixiContainer = pixiConteinerMock();
      const container = new DisplayObjectContainer(pixiContainer);

      const sprite = new Sprite();
      container.add(sprite);
      container.remove(sprite);

      expect(pixiContainer.removeChild).toBeCalledWith(sprite.pixiObj);
    });

    it("but throw error when remove non added sprite", () => {
      const pixiContainer = pixiConteinerMock();
      const container = new DisplayObjectContainer(pixiContainer);

      const sprite = new Sprite();

      expect(() => container.remove(sprite)).toThrowError();
    });

    it("and can check added", () => {
      const pixiContainer = pixiConteinerMock();
      const container = new DisplayObjectContainer(pixiContainer);

      const sprite = new Sprite();

      container.add(sprite);
      expect(container.has(sprite)).toBe(true);

      container.remove(sprite);
      expect(container.has(sprite)).toBe(false);
    });
  });

  it("can iterate Sprites like Set.forEach", () => {
    const pixiContainer = pixiConteinerMock();
    const container = new DisplayObjectContainer(pixiContainer);
    const sprite = new Sprite();
    container.add(sprite);

    const callback = jest.fn();
    container.forEach(callback);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(sprite);
  });

  it("can update with added sprites", () => {
    const pixiContainer = pixiConteinerMock();
    const container = new DisplayObjectContainer(pixiContainer);
    const sprite = new Sprite();
    jest.spyOn(sprite, "update");
    container.add(sprite);

    const owner = jest.fn();
    const deltaSec = 0.125;
    container.update(owner, deltaSec);

    expect(sprite.update).toBeCalledWith(owner, deltaSec);
  });
});
