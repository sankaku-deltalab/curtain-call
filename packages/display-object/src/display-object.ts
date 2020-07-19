import { Transformation } from "@curtain-call/util";

export interface DisplayObject {
  pixiObj: PIXI.DisplayObject;
  trans: Transformation;
  updatePixiObject(deltaSec: number): void;
}
