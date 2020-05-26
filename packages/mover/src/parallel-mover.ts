import { Matrix } from "trans-vector2d";
import { Mover } from "./mover";

/**
 * Use multiple mover parallel.
 */
export class ParallelMover<T> implements Mover<T> {
  private movers: readonly Mover<T>[] = [];

  init(movers: Mover<T>[]): this {
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
    const r = this.movers.reduce(
      (prevResult, mov) => {
        const result = mov.update(world, deltaSec, prevResult.newTrans);
        return {
          done: prevResult.done && result.done,
          newTrans: result.newTrans,
        };
      },
      {
        done: true,
        newTrans: currentTrans,
      }
    );

    return r;
  }
}
