import { Matrix, Vector } from "trans-vector2d";
import { World } from "@curtain-call/actor";
import { LocalConstantMover as ILocalConstantMover } from "@curtain-call/weapon";

export class LocalConstantMover implements ILocalConstantMover {
  private velocity = Matrix.identity;

  setVelocity(velocity: Matrix): this {
    this.velocity = velocity;
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
    const { translation, rotation, scale } = this.velocity.decompose();
    const delta = Matrix.from({
      translation: translation.mlt(deltaSec),
      rotation: rotation * deltaSec,
      scale: scale.sub(Vector.one).mlt(deltaSec).add(Vector.one),
    });
    return { done: false, newTrans: currentTrans.globalize(delta) };
  }
}
