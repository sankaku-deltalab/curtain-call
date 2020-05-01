import * as PIXI from "pixi.js";
import { Vector } from "trans-vector2d";
import { Transformation, matrix2dToPixiMatrix } from "@curtain-call/util";
import { DisplayObject } from "./display-object-manager";

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
export class Sprite<T> implements DisplayObject<T> {
  private size = Vector.one;

  /**
   * @param pixiObj Pixi sprite.
   * @param trans Transformation of self.
   */
  constructor(
    public readonly pixiObj = new PIXI.Sprite(),
    public readonly trans = new Transformation()
  ) {
    pixiObj.anchor = new PIXI.Point(0.5, 0.5);
  }

  /**
   * Update pixi sprite transformation.
   */
  update(): void {
    this.pixiObj.transform.setFromMatrix(
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
    this.pixiObj.texture = texture;
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
    this.pixiObj.scale.x = this.size.x / this.pixiObj.texture.width;
    this.pixiObj.scale.y = this.size.y / this.pixiObj.texture.height;
  }
}
