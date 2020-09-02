import * as PIXI from "pixi.js";
import { DisplayObject } from "@curtain-call/actor";

/**
 * DisplayObjectManager contain DisplayObjects with pixi object.
 */
export interface DisplayObjectManager {
  readonly container: PIXI.Container;

  updatePixiObjects(displayObjects: readonly DisplayObject[]): void;
}
