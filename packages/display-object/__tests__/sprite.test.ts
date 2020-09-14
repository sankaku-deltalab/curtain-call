import * as PIXI from "pixi.js";
import { Matrix, Vector } from "trans-vector2d";
import { Transformation } from "@curtain-call/actor";
import { spriteMock, transMockClass } from "./mock";
import { Sprite } from "../src";

const createSprite = (): {
  pixiObj: PIXI.Sprite;
  trans: Transformation;
  sprite: Sprite;
} => {
  const pixiObj = spriteMock();
  const trans = new transMockClass();
  const sprite = new Sprite(pixiObj, trans);
  return { pixiObj, trans, sprite };
};

describe("@curtain-call/display-object.Sprite", () => {
  it("update sprite transform by Transformation", () => {
    const { pixiObj, trans, sprite } = createSprite();

    jest
      .spyOn(trans, "getGlobal")
      .mockReturnValue(Matrix.translation({ x: 1, y: 2 }));
    sprite.update();

    expect(pixiObj.position.x).toBeCloseTo(1);
    expect(pixiObj.position.y).toBeCloseTo(2);
  });

  it("can set texture", () => {
    const { pixiObj, sprite } = createSprite();

    const texture = new PIXI.Texture(new PIXI.BaseTexture());
    sprite.setTexture(texture);

    expect(pixiObj.texture).toBe(texture);
  });

  it("can set size", () => {
    const { pixiObj, sprite } = createSprite();

    const texture = new PIXI.Texture(new PIXI.BaseTexture());
    jest.spyOn(texture, "width", "get").mockReturnValue(3);
    jest.spyOn(texture, "height", "get").mockReturnValue(4);
    sprite.setTexture(texture);
    sprite.setSize(new Vector(1, 2));

    expect(pixiObj.scale.x).toBeCloseTo(1 / 3);
    expect(pixiObj.scale.y).toBeCloseTo(2 / 4);
  });
});
