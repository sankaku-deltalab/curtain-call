import { Vector, VectorLike } from "trans-vector2d";
import { EventEmitter } from "eventemitter3";
import {
  World,
  PointerInputReceiver as IPointerInputReceiver,
} from "@curtain-call/actor";

/**
 * Receive pointer event from PointerInput.
 */
export class PointerInputReceiver implements IPointerInputReceiver {
  public readonly event = new EventEmitter<{
    down: [World, Vector];
    up: [World, Vector];
    move: [World, Vector, Vector];
    tap: [World, ReadonlyArray<Vector>];
  }>();

  private modifier: (pos: VectorLike) => Vector = (p) => Vector.from(p);
  private children = new Set<PointerInputReceiver>();

  /**
   * Set input point modifier used when event received.
   *
   * @param modifier Function convert original point to modified point.
   * @returns this.
   */
  setModifier(modifier: (pos: VectorLike) => VectorLike): this {
    this.modifier = (p): Vector => Vector.from(modifier(p));
    return this;
  }

  /**
   * Add child receiver.
   * When self event was emitted, child receiver event will be emitted.
   *
   * @param receiver Adding child receiver.
   * @returns this.
   */
  addChild(receiver: PointerInputReceiver): this {
    this.children.add(receiver);
    return this;
  }

  /**
   * Remove child receiver.
   *
   * @param receiver Removing child receiver.
   * @returns this.
   */
  removeChild(receiver: PointerInputReceiver): this {
    this.children.delete(receiver);
    return this;
  }

  /**
   * Receive pointer down event.
   *
   * @param world World.
   * @param pos Pointer down position.
   */
  notifyDown(world: World, pos: Vector): void {
    const convertedPos = this.modifier(pos);

    this.event.emit("down", world, convertedPos);
    this.children.forEach((child) => child.notifyDown(world, convertedPos));
  }

  /**
   * Receive pointer up event.
   *
   * @param world World.
   * @param pos Pointer up position.
   */
  notifyUp(world: World, pos: Vector): void {
    const convertedPos = this.modifier(pos);

    this.event.emit("up", world, convertedPos);
    this.children.forEach((child) => child.notifyUp(world, convertedPos));
  }

  /**
   * Receive (multiple) tap event.
   *
   * @param world World.
   * @param positions Tapped positions. First element is initial tapped position.
   */
  notifyTap(world: World, positions: readonly Vector[]): void {
    const convertedPos = positions.map((p) => this.modifier(p));

    this.event.emit("tap", world, convertedPos);
    this.children.forEach((child) => child.notifyTap(world, convertedPos));
  }

  /**
   * Receive pointer move event.
   *
   * @param world World.
   * @param src Movement position source of this frame movement.
   * @param dest Movement position destination of this frame movement.
   */
  notifyMove(world: World, src: Vector, dest: Vector): void {
    const convertedSrc = this.modifier(src);
    const convertedDest = this.modifier(dest);

    this.event.emit("move", world, convertedSrc, convertedDest);
    this.children.forEach((child) =>
      child.notifyMove(world, convertedSrc, convertedDest)
    );
  }
}
