import { Matrix } from "trans-vector2d";
import { Sprite } from "../src";

describe("@curtain-call/ia-display-object.SSprite", () => {
  it("can init with imageId, zIndex and offset", () => {
    const imageId = "a";
    const zIndex = 123;
    const offset = Matrix.translation({ x: 1, y: 2 });

    const sprite = new Sprite();
    const r = sprite.init({ imageId, zIndex, offset });

    expect(r).toBe(sprite);
  });

  it("deal one drawing sprite", () => {
    const imageId = "a";
    const zIndex = 123;
    const offset = Matrix.translation({ x: 1, y: 2 });

    const sprite = new Sprite().init({ imageId, zIndex, offset });
    const parentTrans = Matrix.rotation(1);
    const r = sprite.calcDrawingRepresentation(parentTrans);

    expect(r).toHaveLength(1);
    expect(r[0].imageId).toBe(imageId);
    expect(r[0].zIndex).toBe(zIndex);
    expect(r[0].transform).toEqual(parentTrans.globalize(offset));
  });

  it("deal drawing sprite with unique object id", () => {
    const imageId = "a";
    const zIndex = 123;
    const offset = Matrix.translation({ x: 1, y: 2 });

    const sprite1 = new Sprite().init({ imageId, zIndex, offset });
    const sprite2 = new Sprite().init({ imageId, zIndex, offset });

    const parentTrans = Matrix.rotation(1);
    const r1 = sprite1.calcDrawingRepresentation(parentTrans);
    const r2 = sprite2.calcDrawingRepresentation(parentTrans);
    const r3From1 = sprite1.calcDrawingRepresentation(parentTrans);

    expect(r1[0].objectId).not.toEqual(r2[0].objectId);
    expect(r1[0].objectId).toEqual(r3From1[0].objectId);
  });
});
