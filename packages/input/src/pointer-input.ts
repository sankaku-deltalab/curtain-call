import { Vector } from "trans-vector2d";
import { EventEmitter } from "eventemitter3";

/**
 * Receive pointer event from dom element.
 */
export class PointerInput {
  /** Event. */
  public readonly event = new EventEmitter<{
    down: [Vector];
    up: [Vector];
    move: [Vector, Vector];
  }>();

  private prevDownPos = Vector.zero;

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
  ): this {
    const canvasNW = new Vector(canvas.clientLeft, canvas.clientTop);
    const inputNW =
      "clientLeft" in input && "clientTop" in input
        ? new Vector(input.clientLeft, input.clientTop)
        : Vector.zero;
    const inputToCanvas = canvasNW.sub(inputNW);

    input.addEventListener("pointerdown", (event) => {
      const ev = event as PointerEvent;
      const downPos = Vector.from(ev).add(inputToCanvas);
      this.prevDownPos = downPos;
      this.event.emit("down", downPos);
    });

    input.addEventListener("pointerup", (event) => {
      const ev = event as PointerEvent;
      this.event.emit("up", Vector.from(ev).add(inputToCanvas));
    });

    input.addEventListener("pointermove", (event) => {
      const ev = event as PointerEvent;
      const src = this.prevDownPos;
      const dest = Vector.from(ev).add(inputToCanvas);
      this.prevDownPos = dest;
      this.event.emit("move", src, dest);
    });

    return this;
  }
}
