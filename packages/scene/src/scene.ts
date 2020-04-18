import * as PIXI from "pixi.js";

export class Scene<T> {
  public readonly head = new PIXI.Container();

  update<T>(_owner: T, _deltaSec: number): void {
    throw new Error("Implement this");
  }
}
