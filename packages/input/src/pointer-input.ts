import { Vector, VectorLike } from "trans-vector2d";
import { inject, autoInjectable } from "tsyringe";
import {
  World,
  EventEmitter,
  PointerInput as IPointerInput,
  PointerInputReceiver,
} from "@curtain-call/actor";
import { PointerInputConnector } from "./pointer-input-connector";
import { TapRecognizer } from "./tap-recognizer";

type PointerInputEvent = EventEmitter<{
  down: [Vector];
  up: [Vector];
  move: [Vector, Vector];
  tap: [ReadonlyArray<Vector>];
}>;

/**
 * Receive pointer event from dom element.
 */
@autoInjectable()
export class PointerInput implements IPointerInput {
  public readonly event: PointerInputEvent;

  private readonly connectors = new Map<
    PointerInputReceiver,
    PointerInputConnector
  >();
  private readonly date: Date;
  private readonly tapRecognizer: TapRecognizer;
  private prevMovePos = Vector.zero;

  constructor(
    @inject("EventEmitter") event?: PointerInputEvent,
    @inject("Date") date?: Date,
    @inject("TapRecognizer") tapRecognizer?: TapRecognizer
  ) {
    if (!(event && date && tapRecognizer)) throw new Error("DI failed");
    this.event = event;
    this.date = date;
    this.tapRecognizer = tapRecognizer;
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
    const connector = this.connectors.get(receiver);
    if (!connector) throw new Error("Receiver is not added");
    this.connectors.delete(receiver);
    connector.destroy(this);
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
