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
  }>();

  constructor() {
    this.event.on("down", (pos) => {
      this.children.forEach((converter, child) => {
        child.event.emit("down", converter(pos));
      });
    });
    this.event.on("up", (pos) => {
      this.children.forEach((converter, child) => {
        child.event.emit("up", converter(pos));
      });
    });
    this.event.on("move", (src, dest) => {
      this.children.forEach((converter, child) => {
        child.event.emit("move", converter(src), converter(dest));
      });
    });
  }

  private children = new Map<
    PointerInputReceiver,
    (pos: VectorLike) => Vector
  >();

  /**
   * Add child receiver.
   * When self event was emitted, child receiver event will be emitted.
   *
   * @param receiver Adding child receiver.
   * @param converter Pointer position converter.
   * @returns this.
   */
  addChild(
    receiver: PointerInputReceiver,
    converter = (pos: VectorLike): Vector => Vector.from(pos)
  ): this {
    this.children.set(receiver, converter);
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
}
