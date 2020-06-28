import { VectorLike, Vector } from "trans-vector2d";
import { Transformation } from "./transformation";

export enum PositionStatusWithArea {
  inArea = "inArea",
  onAreaEdge = "onAreaEdge",
  outOfArea = "outOfArea",
}

export class RectArea {
  private nw = Vector.zero;
  private se = Vector.zero;

  constructor(public readonly trans = new Transformation()) {}

  /**
   * Attach self to other Transformation.
   *
   * @param parent Other Transformation.
   * @returns this.
   */
  attachTo(parent: Transformation): this {
    this.trans.attachTo(parent);
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
  ): PositionStatusWithArea {
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
    if (statuses.some((st) => st === PositionStatusWithArea.outOfArea))
      return PositionStatusWithArea.outOfArea;
    if (statuses.every((st) => st === PositionStatusWithArea.inArea))
      return PositionStatusWithArea.inArea;
    return PositionStatusWithArea.onAreaEdge;
  }

  private calcThresholdStatus(
    threshold: number,
    value: number,
    radius: number,
    isPositiveThreshold: boolean
  ): PositionStatusWithArea {
    const statusValue = ((): number => {
      if (threshold > value + radius) return -1;
      if (threshold < value - radius) return 1;
      return 0;
    })();
    const sign = isPositiveThreshold ? 1 : -1;

    if (sign * statusValue > 0) return PositionStatusWithArea.inArea;
    if (sign * statusValue < 0) return PositionStatusWithArea.outOfArea;
    return PositionStatusWithArea.onAreaEdge;
  }
}
