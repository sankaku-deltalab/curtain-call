import { PointerInputReceiver } from "./pointer-input-receiver";

/**
 * Receive pointer event from dom element.
 */
export interface PointerInput {
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

  /**
   * Add child receiver.
   * When self catch pointer event, child receiver event will be emitted.
   *
   * @param receiver Adding child receiver.
   * @returns this.
   */
  addReceiver(receiver: PointerInputReceiver): this;

  /**
   * Remove child receiver.
   *
   * @param receiver Removing child receiver.
   * @returns this.
   */
  removeReceiver(receiver: PointerInputReceiver): this;
}
