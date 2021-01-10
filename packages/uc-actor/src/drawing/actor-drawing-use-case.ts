import { Matrix } from "trans-vector2d";
import { ActorBase, DrawingRepresentation } from "@curtain-call/entity";

/**
 * `DisplayObject` deal `DrawingRepresentation` for rendering.
 */
export interface DisplayObject {
  /**
   * Update image status.
   *
   * @param deltaSec Delta seconds.
   */
  update(deltaSec: number): void;

  /**
   * Calculate drawing objects.
   *
   * @param parentTransform Parent transformation matrix.
   * @returns Drawing objects.
   */
  calcDrawingRepresentation(
    parentTransform: Matrix
  ): readonly DrawingRepresentation[];
}

export interface DisplayObjectData {
  visible: boolean;
  displayObjects: Set<DisplayObject>;
}

export class ActorDrawingUseCase {
  addDisplayObject(data: DisplayObjectData, obj: DisplayObject): void {
    data.displayObjects.add(obj);
  }

  removeDisplayObject(data: DisplayObjectData, obj: DisplayObject): void {
    data.displayObjects.delete(obj);
  }

  setVisibility(data: DisplayObjectData, visibility: boolean): void {
    data.visible = visibility;
  }

  updateDisplayObjects(data: DisplayObjectData, deltaSec: number): void {
    data.displayObjects.forEach((obj) => obj.update(deltaSec));
  }

  calcDrawingRepresentationOfActor(
    data: DisplayObjectData,
    actor: ActorBase
  ): readonly Readonly<DrawingRepresentation>[] {
    if (!data.visible) return [];
    const trans = actor.transformation();
    const representations: DrawingRepresentation[] = [];
    data.displayObjects.forEach((obj) => {
      representations.push(...obj.calcDrawingRepresentation(trans));
    });
    return representations;
  }
}
