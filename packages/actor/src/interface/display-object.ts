import * as PIXI from "pixi.js";
import { Transformation } from "./transformation";
import { World } from "./world";

export interface DisplayObject {
  readonly pixiObj: PIXI.DisplayObject;
  readonly trans: Transformation;

  /**
   * Update drawing something.
   *
   * @param world
   * @param deltaSec
   */
  update(world: World, deltaSec: number): void;
}
