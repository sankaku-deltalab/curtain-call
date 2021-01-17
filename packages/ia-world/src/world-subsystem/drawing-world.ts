import { WorldBase, DrawingRepresentation } from "@curtain-call/entity";
import { WorldDrawingUseCase } from "@curtain-call/uc-world";

export class DrawingWorld {
  private drawingUseCase: WorldDrawingUseCase;
  private parentInternal?: WorldBase;

  constructor(drawingUseCase?: WorldDrawingUseCase) {
    if (!drawingUseCase) throw new Error("DI failed");
    this.drawingUseCase = drawingUseCase;
  }

  private get parent(): WorldBase {
    if (!this.parentInternal) throw new Error("not initialized");
    return this.parentInternal;
  }

  initDrawingWorld(world: WorldBase): this {
    this.parentInternal = world;
    return this;
  }

  /**
   * Calc drawing objects.
   *
   * @returns Sprites.
   */
  calcDrawingRepresentations(): readonly Readonly<DrawingRepresentation>[] {
    return this.drawingUseCase.calcDrawingRepresentationsFromWorld(this.parent);
  }
}
