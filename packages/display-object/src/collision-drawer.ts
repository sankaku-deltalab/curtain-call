import * as PIXI from "pixi.js";
import { inject, autoInjectable } from "tsyringe";
import { Collision, Transformation } from "@curtain-call/actor";
import {
  matrix2dToPixiMatrix,
  CollisionDrawer as ICollisionDrawer,
} from "@curtain-call/world";

@autoInjectable()
export class CollisionDrawer implements ICollisionDrawer {
  public readonly pixiObj: PIXI.Graphics;
  public readonly trans: Transformation;

  constructor(
    @inject("PIXI.Graphics") pixiObj?: PIXI.Graphics,
    @inject("Transformation") trans?: Transformation
  ) {
    if (!(pixiObj && trans)) throw new Error("DI failed");
    this.pixiObj = pixiObj;
    this.trans = trans;

    this.pixiObj.visible = false;
    this.pixiObj.zIndex = Number.POSITIVE_INFINITY;
  }

  /**
   * Update pixi object transformation.
   */
  update(): void {
    this.pixiObj.transform.setFromMatrix(
      matrix2dToPixiMatrix(this.trans.getGlobal())
    );
  }

  /**
   * Enable drawing.
   *
   * @param enable Enable
   * @returns this.
   */
  setEnable(enable: boolean): this {
    this.pixiObj.visible = enable;
    return this;
  }

  /**
   * Update drawing.
   *
   * @param collisions Collisions would be drawn.
   */
  updateDrawing(collisions: readonly Collision[]): void {
    this.pixiObj.clear().lineStyle(2, 0x209020);
    collisions.forEach((col) =>
      col.getBox2Ds().forEach((box) =>
        this.pixiObj
          .beginFill(0x209020, 0.25)
          .drawRect(box[0], box[1], box[2] - box[0], box[3] - box[1])
          .endFill()
      )
    );
  }
}
