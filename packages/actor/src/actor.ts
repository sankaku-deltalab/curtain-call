import { DisplayObject } from "@curtain-call/display-object";

export class Actor<T> {
  protected readonly displayObjectsSet = new Set<DisplayObject<T>>();

  displayObjects(): DisplayObject<T>[] {
    return Array.from(this.displayObjectsSet.values());
  }

  update(owner: T, deltaSec: number): void {
    for (const obj of this.displayObjects()) {
      obj.update(owner, deltaSec);
    }
  }
}
