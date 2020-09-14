import * as PIXI from "pixi.js";
import { Matrix } from "trans-vector2d";
import { containerMock, transMockClass, worldMockClass } from "./mock";
import { MultiAnimatedSprite } from "../src";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const multiAnimatedSprite = () => {
  const createAnimatedSprite = (): PIXI.AnimatedSprite => {
    const texture = new PIXI.Texture(new PIXI.BaseTexture());
    const sprite = new PIXI.AnimatedSprite([texture]);
    jest.spyOn(sprite, "gotoAndPlay");
    jest.spyOn(sprite, "update");
    return sprite;
  };

  const s1 = createAnimatedSprite();
  const s2 = createAnimatedSprite();
  const a1 = createAnimatedSprite();
  const a2 = createAnimatedSprite();
  const pixiObj = containerMock();
  const trans = new transMockClass();
  const sprite = new MultiAnimatedSprite(
    {
      initialState: "s1",
      state: { s1, s2 },
      anim: { a1, a2 },
    },
    pixiObj,
    trans
  );

  return {
    s1,
    s2,
    a1,
    a2,
    pixiObj,
    trans,
    sprite,
  };
};

describe("@curtain-call/display-object.MultiAnimatedSprite", () => {
  it("update pixi transform by Transformation", () => {
    const { sprite, trans } = multiAnimatedSprite();

    jest
      .spyOn(trans, "getGlobal")
      .mockReturnValue(Matrix.translation({ x: 1, y: 2 }));
    sprite.update(new worldMockClass(), 1);

    expect(sprite.pixiObj.position.x).toBeCloseTo(1);
    expect(sprite.pixiObj.position.y).toBeCloseTo(2);
  });

  it("every PIXI.AnimatedSprite is child of pixiObj", () => {
    const { sprite, s1, s2, a1, a2 } = multiAnimatedSprite();

    [s1, s2, a1, a2].forEach((as) => {
      expect(sprite.pixiObj.children).toContain(as);
    });
  });

  it("view only initialState anim at first", () => {
    const { s1, s2, a1, a2 } = multiAnimatedSprite();

    expect(s1.visible).toBe(true);
    [s2, a1, a2].forEach((as) => {
      expect(as.visible).toBe(false);
    });
  });

  it("play all state sprite at first", () => {
    const { s1, s2 } = multiAnimatedSprite();

    [s1, s2].forEach((as) => {
      expect(as.gotoAndPlay).toBeCalledWith(0);
    });
  });

  it("update sprites", () => {
    const { sprite, s1, s2, a1, a2 } = multiAnimatedSprite();

    const deltaSec = 123;
    const deltaMS = 123 * 1000;
    sprite.update(new worldMockClass(), deltaSec);

    expect(s1.visible).toBe(true);
    [s1, s2, a1, a2].forEach((as) => {
      expect(as.update).toBeCalledWith(deltaMS);
    });
  });

  it("can change state", () => {
    const { sprite, s1, s2, a1, a2 } = multiAnimatedSprite();

    sprite.changeState("s2");

    expect(s2.visible).toBe(true);
    [s1, a1, a2].forEach((as) => {
      expect(as.visible).toBe(false);
    });
  });

  it("can play anim", () => {
    const { sprite, s1, s2, a1, a2 } = multiAnimatedSprite();

    sprite.playAnim("a1");

    expect(a1.visible).toBe(true);
    expect(a1.gotoAndPlay).toBeCalledWith(0);
    [s1, s2, a2].forEach((as) => {
      expect(as.visible).toBe(false);
    });
  });

  it("can not change state while playing anim", () => {
    const { sprite, s1, s2, a1, a2 } = multiAnimatedSprite();

    sprite.playAnim("a1");
    sprite.changeState("s2");

    expect(a1.visible).toBe(true);
    [s1, s2, a2].forEach((as) => {
      expect(as.visible).toBe(false);
    });

    a1.onComplete();

    expect(s2.visible).toBe(true);
    [s1, a1, a2].forEach((as) => {
      expect(as.visible).toBe(false);
    });
  });
});
