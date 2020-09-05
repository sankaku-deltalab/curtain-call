import { Vector } from "trans-vector2d";
import { World, PointerInputReceiver } from "@curtain-call/actor";
import { PointerInput } from "./pointer-input";

/**
 * Connect pointer event to `PointerInputReceiver` from `PointerInput`.
 *
 * @example
 * const world = "world object";
 * const input = new PointerInput().apply(canvas, canvas);
 * const receiver = new PointerInputReceiver<typeof world>();
 *
 * const connector = new PointerInputConnector(world, input, receiver);
 *
 * // if canvas was clicked, receiver.notifyDown was called
 *
 * connector.destroy();
 */
export class PointerInputConnector {
  private readonly downEvent: (pos: Vector) => void;
  private readonly upEvent: (pos: Vector) => void;
  private readonly moveEvent: (src: Vector, dest: Vector) => void;
  private readonly tapEvent: (positions: readonly Vector[]) => void;

  constructor(
    world: World,
    input: PointerInput,
    receiver: PointerInputReceiver
  ) {
    this.downEvent = (pos: Vector): void => receiver.notifyDown(world, pos);
    this.upEvent = (pos: Vector): void => receiver.notifyUp(world, pos);
    this.moveEvent = (src: Vector, dest: Vector): void =>
      receiver.notifyMove(world, src, dest);
    this.tapEvent = (positions: readonly Vector[]): void =>
      receiver.notifyTap(world, positions);

    input.event.on("down", this.downEvent);
    input.event.on("up", this.upEvent);
    input.event.on("move", this.moveEvent);
    input.event.on("tap", this.tapEvent);
  }

  destroy(input: PointerInput): void {
    input.event.removeListener("down", this.downEvent);
    input.event.removeListener("up", this.upEvent);
    input.event.removeListener("move", this.moveEvent);
    input.event.removeListener("tap", this.tapEvent);
  }
}
