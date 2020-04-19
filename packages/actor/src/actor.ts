import * as PIXI from "pixi.js";

export class Actor<T> {
  readonly container = new PIXI.Container();

  update(_owner: T, _deltaSec: number): void {
    throw new Error("Implement this");
  }
}
