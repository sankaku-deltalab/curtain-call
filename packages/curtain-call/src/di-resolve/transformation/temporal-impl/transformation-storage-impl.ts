import { Matrix } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { TransformationStorage } from "@curtain-call/uc-transformation";

export class TransformationStorageImpl implements TransformationStorage {
  createLocalTransformation(_actor: ActorId, _transformation: Matrix): void {
    // do nothing.
  }

  getGlobalTransformation(_actor: ActorId): Matrix {
    return Matrix.identity;
  }

  getLocalTransformation(_actor: ActorId): Matrix {
    return Matrix.identity;
  }

  setLocalTransformation(_actor: ActorId, _transformation: Matrix): void {
    // do nothing.
  }

  deleteTransformationInfo(_actor: ActorId): void {
    // do nothing.
  }
}
