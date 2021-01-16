import { ActorBase, DrawingRepresentation } from "@curtain-call/entity";
import {
  DisplayObject,
  DisplayObjectData,
  ActorDrawingUseCase,
} from "@curtain-call/uc-actor";

export class DrawingActor {
  private readonly objData: DisplayObjectData;
  private readonly drawingUseCase: ActorDrawingUseCase;
  private parentInternal?: ActorBase;

  constructor(drawingUseCase?: ActorDrawingUseCase) {
    if (!drawingUseCase) throw new Error("DI failed");
    this.drawingUseCase = drawingUseCase;
    this.objData = drawingUseCase.createInitialData();
  }

  get parent(): ActorBase {
    if (!this.parentInternal) throw new Error("not initialized");
    return this.parentInternal;
  }

  initDrawingActor(parent: ActorBase): this {
    this.parentInternal = parent;
    return this;
  }

  /**
   * Calc drawing objects of this.
   *
   * @returns Sprites.
   */
  calcDrawingRepresentations(): readonly Readonly<DrawingRepresentation>[] {
    return this.drawingUseCase.calcDrawingRepresentationOfActor(
      this.objData,
      this.parent
    );
  }

  /**
   * Init displaying.
   *
   * @param args
   */
  initDisplaying(args: { displayObjects: Iterable<DisplayObject> }): void {
    this.drawingUseCase.initDisplayObject(this.objData, args);
  }

  /**
   * Set actor visibility.
   *
   * @param visibility
   */
  setVisibility(visibility: boolean): void {
    this.drawingUseCase.setVisibility(this.objData, visibility);
  }

  updateDisplayObjects(deltaSec: number): void {
    this.drawingUseCase.updateDisplayObjects(this.objData, deltaSec);
  }
}
