import * as PIXI from "pixi.js";
import { VectorLike, Matrix, Vector } from "trans-vector2d";
import {
  Transformation,
  RectArea,
  PositionStatusWithArea,
} from "@curtain-call/util";

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
    public readonly tail = new PIXI.Container(),
    private readonly visibleArea = new RectArea()
  ) {
    this.head.addChild(tail);
    visibleArea.attachTo(trans);
  }

  /**
   * Update PIXI drawing.
   */
  update(): void {
    const { translation, rotation, scale } = this.trans.getGlobal().decompose();

    this.tail.position = new PIXI.Point(-translation.x, -translation.y);
    this.head.scale = new PIXI.Point(1 / scale.x, 1 / scale.y);
    this.head.rotation = -rotation;
  }

  /**
   * Set camera resolution in game space.
   *
   * @param gameResolution Camera resolution in game space.
   * @returns this.
   */
  setCameraResolution(gameResolution: VectorLike): this {
    const gameResolutionHalf = Vector.from(gameResolution).div(2);
    this.visibleArea.init(gameResolutionHalf.mlt(-1), gameResolutionHalf);
    return this;
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
      Matrix.from({
        translation,
        rotation,
        scale: new Vector(1 / scale, 1 / scale),
      })
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

  /**
   * Calc position status for visible area.
   *
   * @param globalPos Target position in global coordinates.
   * @param radius Target radius.
   * @returns Status.
   */
  calcVisibilityStatus(
    globalPos: VectorLike,
    radius: number
  ): PositionStatusWithArea {
    return this.visibleArea.calcPositionStatus(globalPos, radius);
  }
}
