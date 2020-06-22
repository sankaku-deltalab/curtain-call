import * as PIXI from "pixi.js";
import { VectorLike, Matrix, Vector } from "trans-vector2d";
import { Transformation } from "@curtain-call/util";

/**
 * Camera transform graphics.
 */
export class Camera {
  /**
   * @param tail Pixi container.
   */
  constructor(
    public readonly trans = new Transformation(),
    public readonly head = new PIXI.Container(),
    public readonly tail = new PIXI.Container()
  ) {
    this.head.addChild(tail);
  }

  update(): void {
    const { translation, rotation, scale } = this.trans.getGlobal().decompose();
    this.tail.position = new PIXI.Point(-translation.x, -translation.y);
    this.head.scale = new PIXI.Point(scale.x, scale.y);
    this.head.rotation = -rotation;
  }

  /**
   * Camera move to position.
   *
   * @param pos Move destination.
   * @returns this.
   */
  moveTo(pos: VectorLike): this {
    const { rotation, scale } = this.trans.getLocal().decompose();
    this.trans.setLocal(Matrix.from({ translation: pos, rotation, scale }));
    return this;
  }

  /**
   * Zoom camera.
   *
   * @param scale New scale.
   * @return this.
   */
  zoomTo(scale: number): this {
    const { translation, rotation } = this.trans.getLocal().decompose();
    this.trans.setLocal(
      Matrix.from({ translation, rotation, scale: Vector.one.mlt(scale) })
    );
    return this;
  }

  /**
   * Rotate camera.
   *
   * @param rotation New rotation.
   * @returns this.
   */
  rotateTo(rotation: number): this {
    const { translation, scale } = this.trans.getLocal().decompose();
    this.trans.setLocal(Matrix.from({ translation, rotation, scale }));
    return this;
  }
}
