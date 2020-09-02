import { VectorLike } from "trans-vector2d";
import { PositionInAreaStatus, Transformation } from "@curtain-call/actor";

export interface Camera {
  readonly trans: Transformation;
  readonly pixiHead: PIXI.Container;
  readonly pixiTail: PIXI.Container;

  /**
   * Update PIXI drawing.
   *
   * @param deltaSec Delta seconds.
   */
  update(deltaSec: number): void;

  /**
   * Set camera resolution in game space.
   *
   * @param gameResolution Camera resolution in game space.
   * @returns this.
   */
  setCameraResolution(gameResolution: VectorLike): this;

  /**
   * Camera move to position.
   *
   * @param pos Move destination.
   * @returns this.
   */
  moveTo(pos: VectorLike): this;

  /**
   * Zoom camera.
   *
   * @param scale New scale.
   * @return this.
   */
  zoomTo(scale: number): this;

  /**
   * Rotate camera.
   *
   * @param rotation New rotation.
   * @returns this.
   */
  rotateTo(rotation: number): this;

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
  ): PositionInAreaStatus;
}
