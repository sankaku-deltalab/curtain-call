import { Matrix } from "trans-vector2d";
import { Mover } from "@curtain-call/mover";

export class Movers<T> {
  private movers: Mover<T>[] = [];

  /**
   * Add mover.
   *
   * @param mover New movers.
   * @returns this.
   */
  add(...mover: readonly Mover<T>[]): this {
    this.movers = this.movers.concat(mover);
    return this;
  }

  /**
   * Remove mover.
   *
   * @param mover Removing movers.
   * @returns this.
   */
  remove(...mover: readonly Mover<T>[]): this {
    this.movers = this.movers.filter((mov) => mover.indexOf(mov) === -1);
    return this;
  }

  /**
   * Update movement and return transformation delta
   *
   * @param scene Scene.
   * @param deltaSec Delta seconds.
   * @param currentTrans Current transform.
   * @returns New transformation and movement was done.
   */
  update(
    scene: T,
    deltaSec: number,
    currentTrans: Matrix
  ): {
    done: boolean;
    newTrans: Matrix;
  } {
    const result = this.movers.reduce(
      (prev, mov) => {
        const r = mov.update(scene, deltaSec, prev.newTrans);
        return {
          done: prev.done && r.done,
          newTrans: r.newTrans,
        };
      },
      { done: true, newTrans: currentTrans }
    );
    return result;
  }
}
