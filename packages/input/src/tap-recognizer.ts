import { Vector } from "trans-vector2d";

export class TapRecognizer {
  private lastDownPos = Vector.zero;
  private lastUpPos = Vector.zero;
  private tapPosStack: Vector[] = [];
  private lastDownTime = -1;
  private lastUpTime = -1;

  private tapDistance = 10;
  private tapDurationSec = 0.3;
  private pressDurationMaxSec = 0.3;

  setTapDistance(distance: number): this {
    this.tapDistance = distance;
    return this;
  }

  setTapDuration(sec: number): this {
    this.tapDurationSec = sec;
    return this;
  }

  setPressDurationMax(sec: number): this {
    this.pressDurationMaxSec = sec;
    return this;
  }

  down(pos: Vector, sec: number): void {
    this.lastDownPos = pos;
    this.lastDownTime = sec;
  }

  up(
    pos: Vector,
    sec: number
  ): { tapped: boolean; tapPositions: ReadonlyArray<Vector> } {
    const prevUpTime = this.lastUpTime;
    this.lastUpTime = sec;
    this.lastUpPos = pos;

    if (this.lastUpTime - prevUpTime > this.tapDurationSec) {
      this.tapPosStack = [];
    }

    const isTapTime =
      this.lastUpTime - this.lastDownTime <= this.pressDurationMaxSec;
    const isTapPos =
      this.lastUpPos.distance(this.lastDownPos) <= this.tapDistance;
    const isMultiTapPos =
      this.tapPosStack.length == 0
        ? true
        : this.lastDownPos.distance(
            this.tapPosStack[this.tapPosStack.length - 1]
          ) <= this.tapDistance;
    const isTap = isTapTime && isTapPos && isMultiTapPos;
    if (isTap) {
      this.tapPosStack.push(this.lastDownPos);
      return { tapped: true, tapPositions: this.tapPosStack };
    }
    return { tapped: false, tapPositions: [] };
  }
}
