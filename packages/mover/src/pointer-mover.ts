import { Vector, Matrix, VectorLike } from "trans-vector2d";
import { PointerInputReceiver } from "@curtain-call/input";
import { Mover } from "./mover";

/**
 * Move by pointer movement.
 */
export class PointerMover<TWorld> implements Mover<TWorld> {
  private delta = Vector.zero;
  private scale = 1;
  private movableAreaNW = Vector.one.mlt(Number.NEGATIVE_INFINITY);
  private movableAreaSE = Vector.one.mlt(Number.POSITIVE_INFINITY);

  /**
   * @param receiver PointerInputReceiver used in internal.
   */
  constructor(private readonly receiver = new PointerInputReceiver<TWorld>()) {
    receiver.event.on("move", (world, src, dest) => {
      this.delta = this.delta.add(dest.sub(src));
    });
  }

  /**
   * Set movement scale.
   *
   * @param scale
   * @returns this.
   */
  setScale(scale: number): this {
    this.scale = scale;
    return this;
  }

  /**
   * Set movable area.
   *
   * @param nw
   * @param se
   * @returns this.
   */
  setMovableArea(nw: VectorLike, se: VectorLike): this {
    this.movableAreaNW = Vector.from(nw);
    this.movableAreaSE = Vector.from(se);
    return this;
  }

  /**
   * Update movement and return transformation delta
   *
   * @param _world World.
   * @param _deltaSec Delta seconds.
   * @param currentTrans Current transform.
   * @returns New transformation and movement was done.
   */
  update(
    _world: TWorld,
    _deltaSec: number,
    currentTrans: Matrix
  ): { done: boolean; newTrans: Matrix } {
    const delta = this.delta.mlt(this.scale);
    this.delta = Vector.zero;
    const currentPos = currentTrans.decompose().translation;
    const movedPos = currentPos.add(delta);
    const clamp = (value: number, min: number, max: number): number =>
      Math.max(Math.min(value, max), min);
    const limitedX = clamp(
      movedPos.x,
      this.movableAreaNW.x,
      this.movableAreaSE.x
    );
    const limitedY = clamp(
      movedPos.y,
      this.movableAreaNW.y,
      this.movableAreaSE.y
    );

    return {
      done: false,
      newTrans: Matrix.from({ ...currentTrans, e: limitedX, f: limitedY }),
    };
  }

  /**
   * Get using `PointerInputReceiver`.
   *
   * @returns Using `PointerInputReceiver`.
   */
  getInputReceiver(): PointerInputReceiver<TWorld> {
    return this.receiver;
  }
}
