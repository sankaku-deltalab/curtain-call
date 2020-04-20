import * as PIXI from "pixi.js";
import { Transformation } from "@curtain-call/util";
import { Sprite } from "../src";
import { Matrix, Vector } from "@curtain-call/util/node_modules/trans-vector2d";

describe("@curtain-call/display-object.Sprite", () => {
  it("has Transformation", () => {
    const sprite = new Sprite();
    expect(sprite.trans).toBeInstanceOf(Transformation);
  });

  it("update sprite transform by Transformation", () => {
    const pixiSprite = new PIXI.Sprite();
    const sprite = new Sprite(pixiSprite);

    sprite.trans.setLocal(Matrix.identity.translate({ x: 1, y: 2 }));
    sprite.update();

    expect(pixiSprite.position.x).toBeCloseTo(1);
    expect(pixiSprite.position.y).toBeCloseTo(2);
  });

  it("can set texture", () => {
    const pixiSprite = new PIXI.Sprite();
    const sprite = new Sprite(pixiSprite);

    const texture = new PIXI.Texture(new PIXI.BaseTexture());
    sprite.setTexture(texture);

    expect(pixiSprite.texture).toBe(texture);
  });

  it("can set size", () => {
    const pixiSprite = new PIXI.Sprite();
    const sprite = new Sprite(pixiSprite);

    const texture = new PIXI.Texture(new PIXI.BaseTexture());
    jest.spyOn(texture, "width", "get").mockReturnValue(3);
    jest.spyOn(texture, "height", "get").mockReturnValue(4);
    sprite.setTexture(texture);
    sprite.setSize(new Vector(1, 2));

    expect(pixiSprite.scale.x).toBeCloseTo(1 / 3);
    expect(pixiSprite.scale.y).toBeCloseTo(2 / 4);
  });
});
