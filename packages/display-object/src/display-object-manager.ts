import * as PIXI from "pixi.js";
import { DisplayObject } from "./display-object";

/**
 * DisplayObjectManager contain DisplayObjects with pixi object.
 */
export class DisplayObjectManager {
  private readonly objectSet = new Set<DisplayObject>();

  /**
   * @param container Pixi container.
   */
  constructor(public readonly container = new PIXI.Container()) {}

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
