import { Vector } from "trans-vector2d";
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
}
