import { Matrix, VectorLike } from "trans-vector2d";
import { World, Mover, Transformation } from "../interface";
import { Actor as IActor } from "../actor-interface";

export class ActorWithTransformation {
  private readonly movers = new Set<Mover>();

  constructor(private readonly sharedTrans: Transformation) {}

  /**
   * Move to specified position.
   *
   * @param pos New position on local space. Not delta.
   * @returns this.
   */
  moveTo(pos: VectorLike): this {
    const { rotation, scale } = this.sharedTrans.getLocal().decompose();
    this.sharedTrans.setLocal(
      Matrix.from({ translation: pos, rotation, scale })
    );
    return this;
  }

  /**
   * Rotate to specified angle.
   *
   * @param angle New angle. Not delta.
   * @returns this.
   */
  rotateTo(angle: number): this {
    const { translation, scale } = this.sharedTrans.getLocal().decompose();
    this.sharedTrans.setLocal(
      Matrix.from({ translation, rotation: angle, scale })
    );
    return this;
  }

  /**
   * Set local transform.
   *
   * @param newLocalTrans New local transform.
   * @returns this.
   */
  setLocalTransform(newLocalTrans: Matrix): this {
    this.sharedTrans.setLocal(newLocalTrans);
    return this;
  }

  /**
   * Swap local transform.
   *
   * @param swapper Function given current transform and return new transform.
   * @returns this.
   */
  swapLocalTransform(swapper: (current: Matrix) => Matrix): this {
    this.sharedTrans.setLocal(swapper(this.sharedTrans.getLocal()));
    return this;
  }

  /**
   * Get Transformation of self.
   *
   * @returns Transformation of self.
   */
  getTransformation(): Transformation {
    return this.sharedTrans;
  }

  /**
   * Attach other actor to self.
   *
   * @param child Attaching child Actor.
   * @param keepWorldTransform When attached, keep world transform of child.
   * @returns this.
   */
  attachActor(child: IActor, keepWorldTransform: boolean): this {
    return this.attachTransformation(
      child.getTransformation(),
      keepWorldTransform
    );
  }

  /**
   * Attach other Transformation to self.
   *
   * @param child Attaching child Transformation.
   * @param keepWorldTransform When attached, keep world transform of child.
   * @returns this.
   */
  attachTransformation(
    child: Transformation,
    keepWorldTransform: boolean
  ): this {
    this.sharedTrans.attachChild(child, keepWorldTransform);
    return this;
  }

  /**
   * Detach child Actor from self.
   *
   * @param child Detaching child Actor.
   * @param keepWorldTransform When detached, keep world transform of child.
   * @return this.
   */
  detachActor(child: IActor, keepWorldTransform: boolean): this {
    return this.detachTransformation(
      child.getTransformation(),
      keepWorldTransform
    );
  }

  /**
   * Detach child Actor from self.
   *
   * @param child Detaching child Transformation.
   * @param keepWorldTransform When detached, keep world transform of child.
   * @return this.
   */
  detachTransformation(
    child: Transformation,
    keepWorldTransform: boolean
  ): this {
    this.sharedTrans.detachChild(child, keepWorldTransform);
    return this;
  }

  /**
   * Add mover.
   *
   * @param mover Adding mover.
   * @returns this.
   */
  addMover(mover: Mover): this {
    this.movers.add(mover);
    return this;
  }

  /**
   * Remove mover.
   *
   * @param mover Removing mover.
   * @returns this.
   */
  removeMover(mover: Mover): this {
    this.movers.delete(mover);
    return this;
  }

  /**
   * Update movement.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void {
    this.sharedTrans.setLocal(
      this.updateMovement(world, deltaSec, this.sharedTrans.getLocal()).newTrans
    );
  }

  /**
   * Update movement and return transformation delta
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   * @param currentTrans Current transform.
   * @returns New transformation and movement was done.
   */
  private updateMovement(
    world: World,
    deltaSec: number,
    currentTrans: Matrix
  ): {
    done: boolean;
    newTrans: Matrix;
  } {
    const movers = Array.from(this.movers);
    const result = movers.reduce(
      (prev, mov) => {
        const r = mov.update(world, deltaSec, prev.newTrans);
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
