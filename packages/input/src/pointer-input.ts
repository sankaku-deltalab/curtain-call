import { Vector, VectorLike } from "trans-vector2d";
import { EventEmitter } from "eventemitter3";
import { TapRecognizer } from "./tap-recognizer";

/**
 * Receive pointer event from dom element.
 */
export class PointerInput {
  public readonly event = new EventEmitter<{
    down: [Vector];
    up: [Vector];
    move: [Vector, Vector];
    tap: [ReadonlyArray<Vector>];
  }>();

  private prevMovePos = Vector.zero;

  constructor(
    private readonly date = new Date(),
    private readonly tapRecognizer = new TapRecognizer()
  ) {
    this.tapRecognizer.event.on("tap", (positions) => {
      this.event.emit("tap", positions);
    });
  }

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
    input.addEventListener("pointerdown", (event) => {
      const downPos = this.inputPosToCanvasPos(
        event as PointerEvent,
        canvas,
        input
      );
      this.prevMovePos = downPos;

      this.event.emit("down", downPos);
      this.tapRecognizer.down(downPos, this.nowSec());
    });

    input.addEventListener("pointerup", (event) => {
      const upPos = this.inputPosToCanvasPos(
        event as PointerEvent,
        canvas,
        input
      );

      this.event.emit("up", upPos);
      this.tapRecognizer.up(upPos, this.nowSec());
    });

    input.addEventListener("pointermove", (event) => {
      const src = this.prevMovePos;
      const dest = this.inputPosToCanvasPos(
        event as PointerEvent,
        canvas,
        input
      );
      this.prevMovePos = dest;

      this.event.emit("move", src, dest);
    });

    return this;
  }

  private inputPosToCanvasPos(
    inputPos: VectorLike,
    canvas: HTMLCanvasElement,
    input: HTMLElement | Document | Window
  ): Vector {
    const canvasNW = new Vector(canvas.clientLeft, canvas.clientTop);
    const inputNW =
      "clientLeft" in input && "clientTop" in input
        ? new Vector(input.clientLeft, input.clientTop)
        : Vector.zero;
    const inputToCanvas = canvasNW.sub(inputNW);
    return Vector.from(inputPos).add(inputToCanvas);
  }

  private nowSec(): number {
    return this.date.getTime() / 1000;
  }
}
