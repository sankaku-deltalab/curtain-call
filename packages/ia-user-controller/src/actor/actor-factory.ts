import {
  injectable,
  inject,
  container,
} from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { ActorCreateUC } from "@curtain-call/uc-actor";
import { Actor } from "./actor";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ActorFactory {
  private readonly actorInstances = new Map<ActorId, Actor>();

  constructor(
    @inject(injectTokens.DIContainer)
    private readonly diContainer: typeof container,
    @inject(injectTokens.ActorCreateUC)
    private readonly actorCreateUC: ActorCreateUC
  ) {}

  createActor(): Actor {
    const actorId = this.actorCreateUC.createActor();
    const actorInstance = this.diContainer
      .resolve<Actor>(injectTokens.Actor)
      .setId(actorId);
    this.actorInstances.set(actorId, actorInstance);
    return actorInstance;
  }

  getActor(actorId: ActorId): Actor {
    const actorInstance = this.actorInstances.get(actorId);
    if (!actorInstance) {
      if (!this.actorCreateUC.hasActor(actorId)) {
        return this.createActor();
      }
      throw new Error("Actor is not created");
    }
    return actorInstance;
  }
}
