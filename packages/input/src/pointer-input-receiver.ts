import { Vector, VectorLike } from "trans-vector2d";
import { EventEmitter } from "eventemitter3";

/**
 * Receive pointer event from PointerInput.
 */
export class PointerInputReceiver<TWorld> {
  public readonly event = new EventEmitter<{
    down: [TWorld, Vector];
    up: [TWorld, Vector];
    move: [TWorld, Vector, Vector];
    tap: [TWorld, ReadonlyArray<Vector>];
  }>();

  private modifier: (pos: VectorLike) => Vector = (p) => Vector.from(p);
  private children = new Set<PointerInputReceiver<TWorld>>();

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
  addChild(receiver: PointerInputReceiver<TWorld>): this {
    this.children.add(receiver);
    return this;
  }

  /**
   * Remove child receiver.
   *
   * @param receiver Removing child receiver.
   * @returns this.
   */
  removeChild(receiver: PointerInputReceiver<TWorld>): this {
    this.children.delete(receiver);
    return this;
  }

  /**
   * Receive pointer down event.
   *
   * @param world World.
   * @param pos Pointer down position.
   */
  notifyDown(world: TWorld, pos: Vector): void {
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
  notifyUp(world: TWorld, pos: Vector): void {
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
  notifyTap(world: TWorld, positions: readonly Vector[]): void {
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
  notifyMove(world: TWorld, src: Vector, dest: Vector): void {
    const convertedSrc = this.modifier(src);
    const convertedDest = this.modifier(dest);

    this.event.emit("move", world, convertedSrc, convertedDest);
    this.children.forEach((child) =>
      child.notifyMove(world, convertedSrc, convertedDest)
    );
  }
}
