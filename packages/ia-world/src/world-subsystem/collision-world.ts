import { WorldBase } from "@curtain-call/entity";
import { WorldCollisionUseCase } from "@curtain-call/uc-world";

export class CollisionWorld {
  private collisionUseCase: WorldCollisionUseCase;
  private parentInternal?: WorldBase;

  constructor(drawingUseCase?: WorldCollisionUseCase) {
    if (!drawingUseCase) throw new Error("DI failed");
    this.collisionUseCase = drawingUseCase;
  }

  private get parent(): WorldBase {
    if (!this.parentInternal) throw new Error("not initialized");
    return this.parentInternal;
  }

  initCollisionWorld(world: WorldBase): this {
    this.parentInternal = world;
    return this;
  }

  update(): void {
    return this.collisionUseCase.checkOverlapAndNotifyToActors(this.parent);
  }
}
