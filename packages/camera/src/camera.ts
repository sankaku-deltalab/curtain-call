import * as PIXI from "pixi.js";
import { Vector, VectorLike } from "trans-vector2d";

/**
 * Camera transform graphics.
 */
export class Camera {
  /**
   * @param tail Pixi container.
   */
  constructor(
    public readonly head = new PIXI.Container(),
    public readonly tail = new PIXI.Container()
  ) {
    this.head.addChild(tail);
  }

  /**
   * Camera move to position.
   *
   * @param pos Move destination.
   * @returns this.
   */
  moveTo(pos: VectorLike): this {
    const iPos = Vector.from(pos).mlt(-1);
    this.tail.position = new PIXI.Point(iPos.x, iPos.y);
    return this;
  }

  /**
   * Zoom camera.
   *
   * @param scale New scale.
   * @return this.
   */
  zoomTo(scale: number): this {
    this.head.scale = new PIXI.Point(scale, scale);
    return this;
  }

  /**
   * Rotate camera.
   *
   * @param rotation New rotation.
   * @returns this.
   */
  rotateTo(rotation: number): this {
    this.head.rotation = -rotation;
    return this;
  }
}
