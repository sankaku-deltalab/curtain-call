import * as PIXI from "pixi.js";
import { autoInjectable, inject } from "tsyringe";
import { DisplayObject } from "@curtain-call/actor";
import { DisplayObjectManager as IDisplayObjectManager } from "@curtain-call/world";

/**
 * DisplayObjectManager contain DisplayObjects with pixi object.
 */
@autoInjectable()
export class DisplayObjectManager implements IDisplayObjectManager {
  public readonly container: PIXI.Container;

  private readonly objectSet = new Set<DisplayObject>();

  /**
   * @param container Pixi container.
   */
  constructor(@inject("PIXI.Container") container?: PIXI.Container) {
    if (!container) throw new Error("DI failed");
    this.container = container;
  }

  updatePixiObjects(displayObjects: readonly DisplayObject[]): void {
    const notAddedYet = new Set<DisplayObject>(displayObjects);
    this.objectSet.forEach((obj) => {
      notAddedYet.delete(obj);
    });

    const newObjects = new Set(displayObjects);
    const removedObjects: DisplayObject[] = [];
    this.objectSet.forEach((contained) => {
      if (newObjects.has(contained)) return;
      removedObjects.push(contained);
    });

    removedObjects.forEach((obj) => {
      this.objectSet.delete(obj);
      this.container.removeChild(obj.pixiObj);
    });
    notAddedYet.forEach((obj) => {
      this.objectSet.add(obj);
      this.container.addChild(obj.pixiObj);
    });
  }
}
