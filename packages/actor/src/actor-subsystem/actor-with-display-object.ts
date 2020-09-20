import { DisplayObject, Transformation, World } from "../interface";

export class ActorWithDisplayObject {
  private readonly objects = new Set<DisplayObject>();

  constructor(private readonly sharedTrans: Transformation) {}

  /**
   * Add display object.
   *
   * @param obj Adding display object.
   * @returns this.
   */
  addDisplayObject(obj: DisplayObject): this {
    this.objects.add(obj);
    this.sharedTrans.attachChild(obj.trans, false);
    return this;
  }

  /**
   * Remove display object.
   *
   * @param obj Removing display object.
   * @returns this.
   */
  removeDisplayObject(obj: DisplayObject): this {
    this.objects.delete(obj);
    return this;
  }

  /**
   * Iterate containing display objects.
   *
   * @param callback
   */
  iterateDisplayObject(callback: (obj: DisplayObject) => void): void {
    this.objects.forEach((o) => callback(o));
  }

  /**
   * Update drawing.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void {
    this.objects.forEach((d) => d.update(world, deltaSec));
  }
}
