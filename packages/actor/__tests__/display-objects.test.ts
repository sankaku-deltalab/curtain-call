import { Sprite } from "@curtain-call/display-object";
import { DisplayObjects } from "../src";

const spriteMock = <T>(): Sprite<T> => {
  const obj = new Sprite();
  jest.spyOn(obj, "update");
  return obj;
};

describe("@curtain-call/DisplayObjects", () => {
  describe("can add DisplayObject", () => {
    it("by function", () => {
      const obj = spriteMock();
      const objects = new DisplayObjects();

      expect(() => objects.add(obj)).not.toThrowError();
    });

    it("but throw error when add added object", () => {
      const obj = spriteMock();
      const objects = new DisplayObjects();
      objects.add(obj);

      expect(() => objects.add(obj)).toThrowError();
    });
  });

  describe("can remove DisplayObject", () => {
    it("by function", () => {
      const obj = spriteMock();
      const objects = new DisplayObjects();
      objects.add(obj);

      expect(() => objects.remove(obj)).not.toThrowError();
    });

    it("but throw error when non added object", () => {
      const obj = spriteMock();
      const objects = new DisplayObjects();

      expect(() => objects.remove(obj)).toThrowError();
    });
  });

  it("can iterate DisplayObject like Set.forEach", () => {
    const obj = spriteMock();
    const objects = new DisplayObjects();
    objects.add(obj);

    const callback = jest.fn();
    objects.forEach(callback);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(obj);
  });

  it("can update added DisplayObject", () => {
    const obj = spriteMock();
    const objects = new DisplayObjects();

    objects.add(obj);
    const world = jest.fn();
    const deltaSec = 0.125;
    objects.update(world, deltaSec);

    expect(obj.update).toBeCalledWith(world, deltaSec);
  });
});
