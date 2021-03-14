import { ActorId } from "@curtain-call/entity";
import { MovementStorage, Movement } from "@curtain-call/uc-transformation";

export class MovementStorageImpl implements MovementStorage {
  addMovement(_actor: ActorId, _movement: Movement): void {
    // do nothing.
  }

  removeMovement(_actor: ActorId, _movement: Movement): void {
    // do nothing.
  }

  getMovements(_actor: ActorId): readonly Movement[] {
    return [];
  }

  setMovements(_actor: ActorId, _movement: Movement[]): readonly Movement[] {
    return [];
  }

  deleteMovementInfo(_actor: ActorId): void {
    // do nothing.
  }
}
