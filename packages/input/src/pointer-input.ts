import { Vector } from "trans-vector2d";
import { PointerInputReceiver } from "./pointer-input-receiver";
import { TapRecognizer } from "./tap-recognizer";

/**
 * Receive pointer event from dom element.
 */
export class PointerInput extends PointerInputReceiver {
  private prevMovePos = Vector.zero;

  constructor(
    private readonly date = new Date(),
    private readonly tapRecognizer = new TapRecognizer()
  ) {
    super();
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
    const canvasNW = new Vector(canvas.clientLeft, canvas.clientTop);
    const inputNW =
      "clientLeft" in input && "clientTop" in input
        ? new Vector(input.clientLeft, input.clientTop)
        : Vector.zero;
    const inputToCanvas = canvasNW.sub(inputNW);

    input.addEventListener("pointerdown", (event) => {
      const ev = event as PointerEvent;
      const downPos = Vector.from(ev).add(inputToCanvas);
      this.prevMovePos = downPos;
      this.event.emit("down", downPos);
      this.tapRecognizer.down(downPos, this.nowSec());
    });

    input.addEventListener("pointerup", (event) => {
      const ev = event as PointerEvent;
      const upPos = Vector.from(ev).add(inputToCanvas);
      this.event.emit("up", upPos);
      this.tapRecognizer.up(upPos, this.nowSec());
    });

    input.addEventListener("pointermove", (event) => {
      const ev = event as PointerEvent;
      const src = this.prevMovePos;
      const dest = Vector.from(ev).add(inputToCanvas);
      this.prevMovePos = dest;
      this.event.emit("move", src, dest);
    });

    return this;
  }

  private nowSec(): number {
    return this.date.getTime() / 1000;
  }
}
