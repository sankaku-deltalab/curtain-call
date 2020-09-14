import * as PIXI from "pixi.js";
import { Vector } from "trans-vector2d";
import { inject, autoInjectable } from "tsyringe";
import { DisplayObject, Transformation } from "@curtain-call/actor";
import { matrix2dToPixiMatrix } from "@curtain-call/world";

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
@autoInjectable()
export class Sprite implements DisplayObject {
  public readonly pixiObj: PIXI.Sprite;
  public readonly trans: Transformation;
  private size = Vector.one;

  constructor(
    @inject("PIXI.Sprite") pixiObj?: PIXI.Sprite,
    @inject("Transformation") trans?: Transformation
  ) {
    if (!(pixiObj && trans)) throw new Error("DI failed");
    this.pixiObj = pixiObj;
    this.trans = trans;
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
