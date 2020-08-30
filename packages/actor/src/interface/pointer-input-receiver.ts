import { Vector, VectorLike } from "trans-vector2d";
import EventEmitter from "eventemitter3";
import { World } from "./world";

/**
 * Receive pointer event from PointerInput.
 */
export interface PointerInputReceiver {
  readonly event: EventEmitter<{
    down: [World, Vector];
    up: [World, Vector];
    move: [World, Vector, Vector];
    tap: [World, ReadonlyArray<Vector>];
  }>;

  /**
   * Set input point modifier used when event received.
   *
   * @param modifier Function convert original point to modified point.
   * @returns this.
   */
  setModifier(modifier: (pos: VectorLike) => VectorLike): this;

  /**
   * Add child receiver.
   * When self event was emitted, child receiver event will be emitted.
   *
   * @param receiver Adding child receiver.
   * @returns this.
   */
  addChild(receiver: PointerInputReceiver): this;

  /**
   * Remove child receiver.
   *
   * @param receiver Removing child receiver.
   * @returns this.
   */
  removeChild(receiver: PointerInputReceiver): this;

  /**
   * Receive pointer down event.
   *
   * @param world World.
   * @param pos Pointer down position.
   */
  notifyDown(world: World, pos: Vector): void;

  /**
   * Receive pointer up event.
   *
   * @param world World.
   * @param pos Pointer up position.
   */
  notifyUp(world: World, pos: Vector): void;

  /**
   * Receive (multiple) tap event.
   *
   * @param world World.
   * @param positions Tapped positions. First element is initial tapped position.
   */
  notifyTap(world: World, positions: readonly Vector[]): void;

  /**
   * Receive pointer move event.
   *
   * @param world World.
   * @param src Movement position source of this frame movement.
   * @param dest Movement position destination of this frame movement.
   */
  notifyMove(world: World, src: Vector, dest: Vector): void;
}
