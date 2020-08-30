import { Vector } from "trans-vector2d";
import EventEmitter from "eventemitter3";

/**
 * Receive pointer event from dom element.
 */
export interface PointerInput {
  readonly event: EventEmitter<{
    down: [Vector];
    up: [Vector];
    move: [Vector, Vector];
    tap: [ReadonlyArray<Vector>];
  }>;

  /**
   * Add event to element.
   *
   * @param canvas Canvas element used in game.
   * @param input Pointer input assigning element.
   * @return this.
   */
  apply(
    canvas: HTMLCanvasElement,
    input: HTMLElement | Document | Window
  ): this;
}
