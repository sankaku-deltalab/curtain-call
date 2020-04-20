import * as PIXI from "pixi.js";
import { Vector } from "trans-vector2d";
import { Transformation, matrix2dToPixiMatrix } from "@curtain-call/util";

/**
 * Sprite.
 *
 * @example
 * import { Vector, Matrix } from "trans-vector2d";
 *
 * const sprite = new Sprite()
 *   .setTexture(foo)
 *   .setSize(new Vector(1, 2));
 *
 * sprite.trans.setLocal(Matrix.from({ translation: {x: 1, y: 2} }));
 * sprite.update();
 */
export class Sprite {
  /** Transformation of self. */
  public readonly trans = new Transformation();
  private size = Vector.one;

  /**
   * @param pixiSprite Pixi sprite.
   */
  constructor(public readonly pixiSprite = new PIXI.Sprite()) {
    pixiSprite.anchor = new PIXI.Point(0.5, 0.5);
  }

  /**
   * Update pixi sprite transformation.
   */
  update(): void {
    this.pixiSprite.transform.setFromMatrix(
      matrix2dToPixiMatrix(this.trans.getGlobal())
    );
  }

  /**
   * Set texture.
   *
   * @param texture New texture.
   * @returns this.
   */
  setTexture(texture: PIXI.Texture): this {
    this.pixiSprite.texture = texture;
    this.updateSpriteSize();
    return this;
  }

  /**
   * Set sprite size.
   *
   * @param size New size.
   * @returns this.
   */
  setSize(size: Vector): this {
    this.size = size;
    this.updateSpriteSize();
    return this;
  }

  private updateSpriteSize(): void {
    this.pixiSprite.scale.x = this.size.x / this.pixiSprite.texture.width;
    this.pixiSprite.scale.y = this.size.y / this.pixiSprite.texture.height;
  }
}
