import { Vector, Matrix } from "trans-vector2d";
import { PointerInputReceiver } from "@curtain-call/input";
import { Mover } from "./mover";

/**
 * Move by pointer movement.
 */
export class PointerMover<T> implements Mover<T> {
  private delta = Vector.zero;
  private scale = 1;

  /**
   * @param receiver PointerInputReceiver used in internal.
   */
  constructor(private readonly receiver = new PointerInputReceiver()) {
    receiver.event.on("move", (src, dest) => {
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
   * Set PointerInputReceiver parent.
   *
   * @param parent
   * @returns this.
   */
  setParent(parent: PointerInputReceiver): this {
    parent.addChild(this.receiver);
    return this;
  }

  /**
   * Remove PointerInputReceiver parent.
   *
   * @param parent
   * @returns this.
   */
  removeParent(parent: PointerInputReceiver): this {
    parent.removeChild(this.receiver);
    return this;
  }

  /**
   * Update movement and return transformation delta
   *
   * @param _scene Scene.
   * @param _deltaSec Delta seconds.
   * @param currentTrans Current transform.
   * @returns New transformation and movement was done.
   */
  update(
    _scene: T,
    _deltaSec: number,
    currentTrans: Matrix
  ): { done: boolean; newTrans: Matrix } {
    const delta = this.delta.mlt(this.scale);
    this.delta = Vector.zero;

    return { done: false, newTrans: currentTrans.translated(delta) };
  }
}
