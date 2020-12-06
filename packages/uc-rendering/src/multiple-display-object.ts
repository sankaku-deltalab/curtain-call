import { DisplayObject } from "./display-object";

export interface MultipleDisplayObject extends DisplayObject {
  /**
   * Add display objects.
   *
   * @param objects Display objects.
   */
  add(objects: readonly DisplayObject[]): void;

  /**
   * Remove display objects.
   *
   * @param objects Display objects.
   */
  remove(objects: readonly DisplayObject[]): void;
}
