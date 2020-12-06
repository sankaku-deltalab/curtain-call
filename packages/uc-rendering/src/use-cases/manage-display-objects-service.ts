import { DisplayObject } from "../display-object";
import { MultipleDisplayObject } from "../multiple-display-object";

export interface ManageDisplayObjectsService {
  /**
   * Add display object to manager.
   *
   * @param displayObjects Objects would be added.
   * @param manager Manager.
   */
  addDisplayObjects(
    displayObjects: readonly DisplayObject[],
    manager: MultipleDisplayObject
  ): void;

  /**
   * Remove display object to manager.
   *
   * @param displayObjects Objects would be removed.
   * @param manager Manager.
   */
  removeDisplayObjects(
    displayObjects: readonly DisplayObject[],
    manager: MultipleDisplayObject
  ): void;
}
