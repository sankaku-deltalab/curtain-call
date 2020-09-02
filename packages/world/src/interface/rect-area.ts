import { VectorLike } from "trans-vector2d";
import { Transformation, PositionInAreaStatus } from "@curtain-call/actor";

export interface RectArea {
  readonly trans: Transformation;

  /**
   * Init rectangle area.
   *
   * @param nw NW point on this.trans.
   * @param se SE point on this.trans.
   * @returns this.
   */
  init(nw: VectorLike, se: VectorLike): this;

  /**
   * Calc position status for this area.
   *
   * @param globalPos Target position in global coordinates.
   * @param globalRadius Target radius.
   * @returns Status.
   */
  calcPositionStatus(
    globalPos: VectorLike,
    globalRadius: number
  ): PositionInAreaStatus;
}
