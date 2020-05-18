import * as PIXI from "pixi.js";
import { Transformation, matrix2dToPixiMatrix } from "@curtain-call/util";
import { DisplayObject } from "./display-object-manager";

/**
 * Container.
 *
 * @example
 * import { Vector, Matrix } from "trans-vector2d";
 *
 * const sprite = new PIXI.Sprite();
 * const container = new Container()
 *   .addChild(sprite)
 *
 * container.trans.setLocal(Matrix.from({ translation: {x: 1, y: 2} }));
 * container.update();
 */
export class Container<T> implements DisplayObject<T> {
  /**
   * @param pixiObj Pixi container.
   * @param trans Transformation of self.
   */
  constructor(
    public readonly pixiObj = new PIXI.Container(),
    public readonly trans = new Transformation()
  ) {}

  /**
   * Update pixi sprite transformation.
   */
  update(): void {
    this.pixiObj.transform.setFromMatrix(
      matrix2dToPixiMatrix(this.trans.getGlobal())
    );

    new PIXI.Sprite();
  }

  /**
   * Add PIXI objects as child.
   *
   * @param obj PIXI.DisplayObject.
   * @returns this.
   */
  addChild(...obj: readonly PIXI.DisplayObject[]): this {
    this.pixiObj.addChild(...obj);
    return this;
  }

  /**
   * Remove child PIXI objects.
   *
   * @param obj PIXI.DisplayObject.
   * @returns this.
   */
  removeChild(...obj: readonly PIXI.DisplayObject[]): this {
    this.pixiObj.removeChild(...obj);
    return this;
  }
}
