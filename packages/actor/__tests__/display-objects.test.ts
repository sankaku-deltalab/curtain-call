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

    it("and update them", () => {
      const obj = spriteMock();
      const objects = new DisplayObjects();

      objects.add(obj);
      const scene = jest.fn();
      const deltaSec = 0.125;
      objects.update(scene, deltaSec);

      expect(obj.update).toBeCalledWith(scene, deltaSec);
    });
  });
});
