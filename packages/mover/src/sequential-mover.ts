import { Matrix } from "trans-vector2d";
import { Mover } from "./mover";

/**
 * Use multiple mover sequentially.
 */
export class SequentialMover<T> implements Mover<T> {
  private movers: readonly Mover<T>[] = [];
  private currentMoverIndex = 0;

  init(movers: Mover<T>[]): this {
    this.currentMoverIndex = 0;
    this.movers = movers;
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
    world: T,
    deltaSec: number,
    currentTrans: Matrix
  ): { done: boolean; newTrans: Matrix } {
    if (this.currentMoverIndex >= this.movers.length)
      return { done: true, newTrans: currentTrans };

    const r = this.movers[this.currentMoverIndex].update(
      world,
      deltaSec,
      currentTrans
    );
    if (r.done) this.currentMoverIndex += 1;

    return {
      done: this.currentMoverIndex >= this.movers.length,
      newTrans: r.newTrans,
    };
  }
}
