import { v4 as uuidv4 } from "uuid";
import { Matrix } from "trans-vector2d";
import { DrawingObjectSprite, DisplayObject } from "@curtain-call/uc-rendering";

export class Sprite implements DisplayObject {
  private objectId = uuidv4();
  private imageId = "";
  private zIndex = 0;
  private offset = Matrix.identity;

  init(args: { imageId: string; zIndex: number; offset: Matrix }): this {
    this.imageId = args.imageId;
    this.zIndex = args.zIndex;
    this.offset = args.offset;
    return this;
  }

  /**
   * Update image status.
   *
   * @param deltaSec Delta seconds.
   */
  update(_deltaSec: number): void {
    // do nothing.
  }

  /**
   * Calculate drawing objects.
   *
   * @param parentTransform Parent transformation matrix.
   * @returns Drawing objects.
   */
  calcDrawingObject(parentTransform: Matrix): readonly [DrawingObjectSprite] {
    return [
      {
        drawingObjectType: "sprite",
        objectId: this.objectId,
        zIndex: this.zIndex,
        imageId: this.imageId,
        transform: parentTransform.globalize(this.offset),
      },
    ];
  }
}
