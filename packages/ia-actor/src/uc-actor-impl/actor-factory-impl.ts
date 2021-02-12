import {
  container,
  injectable,
  inject,
} from "@curtain-call/shared-dependencies";
import { ActorFactory } from "@curtain-call/uc-actor";
import { Actor } from "../actor";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ActorFactoryImpl implements ActorFactory<Actor> {
  constructor(
    @inject(injectTokens.DIContainer)
    private readonly diContainer: typeof container
  ) {}

  createActor(): Actor {
    const actorId = Symbol();
    return this.diContainer.resolve<Actor>(injectTokens.Actor).setId(actorId);
  }
}
