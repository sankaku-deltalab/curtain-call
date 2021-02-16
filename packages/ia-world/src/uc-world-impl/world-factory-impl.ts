import {
  injectable,
  inject,
  container,
} from "@curtain-call/shared-dependencies";
import { WorldId } from "@curtain-call/entity";
import { WorldFactory } from "@curtain-call/uc-world";
import { World } from "../world";
import { injectTokens } from "../inject-tokens";

@injectable()
export class WorldFactoryImpl implements WorldFactory<World> {
  constructor(
    @inject(injectTokens.DIContainer)
    private readonly diContainer: typeof container
  ) {}

  createWorld(newWorldId: WorldId): World {
    return this.diContainer
      .resolve<World>(injectTokens.World)
      .setId(newWorldId);
  }
}
