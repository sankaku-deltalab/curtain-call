import { Transformation } from "@curtain-call/util";
import { DisplayObject } from "@curtain-call/display-object";

export class DisplayObjects<T> {
  public readonly trans = new Transformation();
  private readonly displayObjectsSet = new Set<DisplayObject<T>>();

  objects(): DisplayObject<T>[] {
    return Array.from(this.displayObjectsSet.values());
  }

  add(obj: DisplayObject<T>): this {
    if (this.displayObjectsSet.has(obj))
      throw new Error("Object was already added");
    this.displayObjectsSet.add(obj);
    obj.trans.attachTo(this.trans);
    return this;
  }

  remove(obj: DisplayObject<T>): this {
    const removed = this.displayObjectsSet.delete(obj);
    if (!removed) throw new Error("Object is not added");
    obj.trans.detachFromParent();
    return this;
  }

  update(owner: T, deltaSec: number): void {
    this.displayObjectsSet.forEach((obj) => obj.update(owner, deltaSec));
  }
}
