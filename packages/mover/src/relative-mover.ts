import { Matrix, Vector } from "trans-vector2d";
import { Mover } from "./mover";

export class RelativeMover<T> implements Mover<T> {
  private delta = Matrix.identity;

  setDelta(delta: Matrix): this {
    this.delta = delta;
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
    const { translation, rotation, scale } = this.delta.decompose();
    const delta = Matrix.from({
      translation: translation.mlt(deltaSec),
      rotation: rotation * deltaSec,
      scale: scale.sub(Vector.one).mlt(deltaSec).add(Vector.one),
    });
    return { done: false, newTrans: currentTrans.globalize(delta) };
  }
}
