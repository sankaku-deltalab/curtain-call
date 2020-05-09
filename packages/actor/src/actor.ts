import { Transformation } from "@curtain-call/util";
import { Health } from "@curtain-call/health";
import { DisplayObjects } from "./display-objects";

export class Actor<T> {
  public readonly trans = new Transformation();
  public readonly displayObjects = new DisplayObjects<T>();
  public readonly health = new Health<T>();

  update(owner: T, deltaSec: number): void {
    this.displayObjects.update(owner, deltaSec);
  }
}
