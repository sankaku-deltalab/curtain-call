import * as PIXI from "pixi.js";
import { Transformation } from "@curtain-call/util";

export interface DisplayObject<T> {
  pixiObj: PIXI.DisplayObject;
  trans: Transformation;
  update(owner: T, deltaSec: number): void;
}

/**
 * DisplayObjectContainer contain DisplayObjects with pixi object.
 */
export class DisplayObjectContainer<T> {
  private readonly objects = new Set<DisplayObject<T>>();

  /**
   * @param container Pixi container.
   */
  constructor(public readonly container = new PIXI.Container()) {}

  /**
   * Update containing objects.
   *
   * @param owner Updating owner like scene.
   * @param deltaSec Delta seconds.
   */
  update(owner: T, deltaSec: number): void {
    this.objects.forEach((obj) => obj.update(owner, deltaSec));
  }

  /**
   * Add object.
   *
   * @param obj Adding DisplayObject.
   * @returns this.
   */
  add(obj: DisplayObject<T>): this {
    if (this.objects.has(obj))
      throw new Error("Display object was already added");
    this.objects.add(obj);
    this.container.addChild(obj.pixiObj);
    return this;
  }

  /**
   * Remove added object.
   *
   * @param obj Removing DisplayObject.
   * @return this.
   */
  remove(obj: DisplayObject<T>): this {
    const removed = this.objects.delete(obj);
    if (!removed) throw new Error("Display object is not added");
    this.container.removeChild(obj.pixiObj);
    return this;
  }
}
