import { DisplayObject } from "../display-object";
import { MultipleDisplayObject } from "../multiple-display-object";
import { ManageDisplayObjectsService } from "../use-cases/manage-display-objects-service";

export class ManageDisplayObjectsServiceImpl
  implements ManageDisplayObjectsService {
  /**
   * Add display object to MultipleDisplayObject.
   *
   * @param displayObjects Objects would be added.
   * @param multi Manager.
   */
  addDisplayObjects(
    displayObjects: readonly DisplayObject[],
    multi: MultipleDisplayObject
  ): void {
    multi.add(displayObjects);
  }

  /**
   * Remove display object to MultipleDisplayObject.
   *
   * @param displayObjects Objects would be removed.
   * @param multi Manager.
   */
  removeDisplayObjects(
    displayObjects: readonly DisplayObject[],
    multi: MultipleDisplayObject
  ): void {
    multi.remove(displayObjects);
  }
}
