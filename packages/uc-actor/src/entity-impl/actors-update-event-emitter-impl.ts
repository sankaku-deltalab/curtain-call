import { injectable, inject } from "@curtain-call/shared-dependencies";
import {
  ActorId,
  ActorsUpdateEventEmitter,
  Seconds,
} from "@curtain-call/entity";
import { UpdateActorUC } from "../use-cases";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ActorsUpdateEventEmitterImpl implements ActorsUpdateEventEmitter {
  constructor(
    @inject(injectTokens.UpdateActorUC)
    private readonly updateActorUC: UpdateActorUC
  ) {}

  notifyPreUpdate(
    actors: readonly ActorId[],
    deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    actors.forEach((actor) => {
      const delta = deltaSec.get(actor);
      if (delta === undefined) throw new Error("deltaSec map is not completed");
      this.updateActorUC.emitPreUpdateEvent(actor, delta);
    });
  }

  notifyUpdate(
    actors: readonly ActorId[],
    deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    actors.forEach((actor) => {
      const delta = deltaSec.get(actor);
      if (delta === undefined) throw new Error("deltaSec map is not completed");
      this.updateActorUC.emitUpdateEvent(actor, delta);
    });
  }

  notifyPostUpdate(
    actors: readonly ActorId[],
    deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    actors.forEach((actor) => {
      const delta = deltaSec.get(actor);
      if (delta === undefined) throw new Error("deltaSec map is not completed");
      this.updateActorUC.emitPostUpdateEvent(actor, delta);
    });
  }
}
