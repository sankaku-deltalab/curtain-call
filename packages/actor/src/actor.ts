import { Transformation } from "@curtain-call/util";
import { DisplayObjects } from "./display-objects";

export class Actor<T> {
  public readonly trans = new Transformation();
  public readonly displayObjects = new DisplayObjects<T>();

  update(owner: T, deltaSec: number): void {
    this.displayObjects.update(owner, deltaSec);
  }
}
