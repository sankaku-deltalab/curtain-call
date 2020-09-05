import { Vector, Matrix, VectorLike } from "trans-vector2d";
import { inject, autoInjectable, container as diContainer } from "tsyringe";
import { Mover, World, PointerInputReceiver } from "@curtain-call/actor";

export { diContainer };

/**
 * Move by pointer movement.
 */
@autoInjectable()
export class PointerMover implements Mover {
  private readonly receiver: PointerInputReceiver;
  private delta = Vector.zero;
  private scale = 1;
  private movableAreaNW = Vector.one.mlt(Number.NEGATIVE_INFINITY);
  private movableAreaSE = Vector.one.mlt(Number.POSITIVE_INFINITY);

  /**
   * @param receiver PointerInputReceiver used in internal.
   */
  constructor(
    @inject("PointerInputReceiver")
    receiver?: PointerInputReceiver
  ) {
    if (!receiver) throw new Error("DI failed");
    this.receiver = receiver;

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
   * @param world World.
   * @param deltaSec Delta seconds.
   * @param currentTrans Current transform.
   * @returns New transformation and movement was done.
   */
  update(
    world: World,
    deltaSec: number,
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
  getInputReceiver(): PointerInputReceiver {
    return this.receiver;
  }
}
