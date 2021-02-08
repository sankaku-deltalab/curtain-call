import { injectable, inject, Matrix } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { TransformationStorage } from "@curtain-call/uc-collision";
import { TransformationStorage as MasterTransformationStorage } from "@curtain-call/uc-transformation";
import { injectTokens } from "../inject-tokens";

@injectable()
export class TransformationStorageImpl implements TransformationStorage {
  constructor(
    @inject(injectTokens.MasterTransformationStorage)
    private readonly masterTransformationStorage: MasterTransformationStorage
  ) {}

  getTransformation(
    actorIds: readonly ActorId[]
  ): Map<ActorId, Readonly<Matrix>> {
    return new Map(
      actorIds.map<[ActorId, Readonly<Matrix>]>((actor) => [
        actor,
        this.masterTransformationStorage.getGlobalTransformation(actor),
      ])
    );
  }
}
