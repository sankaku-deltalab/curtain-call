import { Matrix } from "@curtain-call/shared-dependencies";
import { ActorId, Seconds } from "@curtain-call/entity";

export interface Movement {
  update(
    actorId: ActorId,
    deltaSec: Seconds,
    currentTrans: Matrix
  ): { done: boolean; nextTrans: Matrix };
}

export interface MovementStorage {
  addMovement(actor: ActorId, movement: Movement): void;
  removeMovement(actor: ActorId, movement: Movement): void;
  getMovements(actor: ActorId): readonly Movement[];
  setMovements(actor: ActorId, movement: Movement[]): readonly Movement[];
  deleteMovementInfo(actor: ActorId): void;
}

export interface TransformationStorage {
  createLocalTransformation(actor: ActorId, transformation: Matrix): void;
  getGlobalTransformation(actor: ActorId): Matrix;
  getLocalTransformation(actor: ActorId): Matrix;
  setLocalTransformation(actor: ActorId, transformation: Matrix): void;
  deleteTransformationInfo(actor: ActorId): void;
}
