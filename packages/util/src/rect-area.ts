import { VectorLike, Vector } from "trans-vector2d";
import { autoInjectable, inject } from "tsyringe";
import { PositionInAreaStatus, Transformation } from "@curtain-call/actor";
import { RectArea as IRectArea } from "@curtain-call/world";

@autoInjectable()
export class RectArea implements IRectArea {
  public readonly trans: Transformation;

  private nw = Vector.zero;
  private se = Vector.zero;

  constructor(@inject("Transformation") trans?: Transformation) {
    if (!trans) throw new Error("DI failed");
    this.trans = trans;
  }

  /**
   * Attach self to other Transformation.
   *
   * @param parent Other Transformation.
   * @returns this.
   */
  attachTo(parent: Transformation): this {
    parent.attachChild(this.trans, false);
    return this;
  }

  /**
   * Init rectangle area.
   *
   * @param nw NW point on this.trans.
   * @param se SE point on this.trans.
   * @returns this.
   */
  init(nw: VectorLike, se: VectorLike): this {
    this.nw = Vector.from(nw);
    this.se = Vector.from(se);
    return this;
  }

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
  ): PositionInAreaStatus {
    const relPos = this.trans.getGlobal().localizePoint(globalPos);
    const { scale } = this.trans.getGlobal().decompose();
    const mapping: [boolean, number, number, number][] = [
      [true, this.nw.x, relPos.x, globalRadius / scale.x],
      [false, this.se.x, relPos.x, globalRadius / scale.x],
      [true, this.nw.y, relPos.y, globalRadius / scale.y],
      [false, this.se.y, relPos.y, globalRadius / scale.y],
    ];
    const statuses = mapping.map(([positive, threshold, value, localRadius]) =>
      this.calcThresholdStatus(threshold, value, localRadius, positive)
    );
    if (statuses.some((st) => st === PositionInAreaStatus.outOfArea))
      return PositionInAreaStatus.outOfArea;
    if (statuses.every((st) => st === PositionInAreaStatus.inArea))
      return PositionInAreaStatus.inArea;
    return PositionInAreaStatus.onAreaEdge;
  }

  private calcThresholdStatus(
    threshold: number,
    value: number,
    radius: number,
    isPositiveThreshold: boolean
  ): PositionInAreaStatus {
    const statusValue = ((): number => {
      if (threshold > value + radius) return -1;
      if (threshold < value - radius) return 1;
      return 0;
    })();
    const sign = isPositiveThreshold ? 1 : -1;

    if (sign * statusValue > 0) return PositionInAreaStatus.inArea;
    if (sign * statusValue < 0) return PositionInAreaStatus.outOfArea;
    return PositionInAreaStatus.onAreaEdge;
  }
}
