import * as PIXI from "pixi.js";
import { inject, autoInjectable } from "tsyringe";
import { DisplayObject, Transformation } from "@curtain-call/actor";
import { matrix2dToPixiMatrix } from "@curtain-call/world";

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
@autoInjectable()
export class Container implements DisplayObject {
  public readonly pixiObj: PIXI.Container;
  public readonly trans: Transformation;

  constructor(
    @inject("PIXI.Container") pixiObj?: PIXI.Container,
    @inject("Transformation") trans?: Transformation
  ) {
    if (!(pixiObj && trans)) throw new Error("DI failed");
    this.pixiObj = pixiObj;
    this.trans = trans;
  }

  /**
   * Update pixi sprite transformation.
   */
  notifyPreDraw(): void {
    this.pixiObj.transform.setFromMatrix(
      matrix2dToPixiMatrix(this.trans.getGlobal())
    );
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
