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
      this.notifyTap(positions);
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
      const downPos = Vector.from(event as PointerEvent).add(inputToCanvas);
      this.prevMovePos = downPos;

      this.notifyDown(downPos);
      this.tapRecognizer.down(downPos, this.nowSec());
    });

    input.addEventListener("pointerup", (event) => {
      const upPos = Vector.from(event as PointerEvent).add(inputToCanvas);

      this.notifyUp(upPos);
      this.tapRecognizer.up(upPos, this.nowSec());
    });

    input.addEventListener("pointermove", (event) => {
      const src = this.prevMovePos;
      const dest = Vector.from(event as PointerEvent).add(inputToCanvas);
      this.prevMovePos = dest;

      this.notifyMove(src, dest);
    });

    return this;
  }

  private nowSec(): number {
    return this.date.getTime() / 1000;
  }
}
