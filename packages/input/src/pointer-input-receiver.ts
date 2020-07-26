import { Vector, VectorLike } from "trans-vector2d";
import { EventEmitter } from "eventemitter3";

/**
 * Receive pointer event from PointerInput.
 */
export class PointerInputReceiver {
  /** Event positions. */
  public readonly event = new EventEmitter<{
    down: [Vector];
    up: [Vector];
    move: [Vector, Vector];
    tap: [ReadonlyArray<Vector>];
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
   * @param pos Pointer down position.
   */
  notifyDown(pos: Vector): void {
    const convertedPos = this.modifier(pos);

    this.event.emit("down", convertedPos);
    this.children.forEach((child) => child.notifyDown(convertedPos));
  }

  /**
   * Receive pointer up event.
   *
   * @param pos Pointer up position.
   */
  notifyUp(pos: Vector): void {
    const convertedPos = this.modifier(pos);

    this.event.emit("up", convertedPos);
    this.children.forEach((child) => child.notifyUp(convertedPos));
  }

  /**
   * Receive (multiple) tap event.
   *
   * @param positions Tapped positions. First element is initial tapped position.
   */
  notifyTap(positions: readonly Vector[]): void {
    const convertedPos = positions.map((p) => this.modifier(p));

    this.event.emit("tap", convertedPos);
    this.children.forEach((child) => child.notifyTap(convertedPos));
  }

  /**
   * Receive pointer move event.
   *
   * @param src Movement position source of this frame movement.
   * @param dest Movement position destination of this frame movement.
   */
  notifyMove(src: Vector, dest: Vector): void {
    const convertedSrc = this.modifier(src);
    const convertedDest = this.modifier(dest);

    this.event.emit("move", convertedSrc, convertedDest);
    this.children.forEach((child) =>
      child.notifyMove(convertedSrc, convertedDest)
    );
  }
}
