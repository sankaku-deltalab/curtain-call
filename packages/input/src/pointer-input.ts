import { Vector, VectorLike } from "trans-vector2d";
import { EventEmitter } from "eventemitter3";
import {
  World,
  PointerInput as IPointerInput,
  PointerInputReceiver,
} from "@curtain-call/actor";
import { PointerInputConnector } from "./pointer-input-connector";
import { TapRecognizer } from "./tap-recognizer";

/**
 * Receive pointer event from dom element.
 */
export class PointerInput implements IPointerInput {
  public readonly event = new EventEmitter<{
    down: [Vector];
    up: [Vector];
    move: [Vector, Vector];
    tap: [ReadonlyArray<Vector>];
  }>();

  private readonly connectors = new Map<
    PointerInputReceiver,
    PointerInputConnector
  >();
  private prevMovePos = Vector.zero;

  constructor(
    private readonly date = new Date(),
    private readonly tapRecognizer = new TapRecognizer()
  ) {}

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
      const tapResult = this.tapRecognizer.up(upPos, this.nowSec());
      if (tapResult.tapped) {
        this.event.emit("tap", tapResult.tapPositions);
      }
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

  /**
   * Add child receiver.
   * When self catch pointer event, child receiver event will be emitted.
   *
   * @param world World using receiver.
   * @param receiver Adding child receiver.
   * @returns this.
   */
  addReceiver(world: World, receiver: PointerInputReceiver): this {
    if (this.connectors.has(receiver))
      throw new Error("Receiver was already added");
    this.connectors.set(
      receiver,
      new PointerInputConnector(world, this, receiver)
    );
    return this;
  }

  /**
   * Remove child receiver.
   *
   * @param receiver Removing child receiver.
   * @returns this.
   */
  removeReceiver(receiver: PointerInputReceiver): this {
    if (!this.connectors.has(receiver))
      throw new Error("Receiver is not added");
    this.connectors.delete(receiver);
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
