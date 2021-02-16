import { injectable, inject } from "@curtain-call/shared-dependencies";
import {
  Seconds,
  WorldId,
  WorldsUpdateEventEmitter,
} from "@curtain-call/entity";
import { UpdateWorldUC } from "../use-cases";
import { injectTokens } from "../inject-tokens";

@injectable()
export class WorldsUpdateEventEmitterImpl implements WorldsUpdateEventEmitter {
  constructor(
    @inject(injectTokens.UpdateWorldUC)
    private readonly updateWorldUC: UpdateWorldUC
  ) {}

  notifyPreUpdate(world: WorldId, deltaSec: Seconds): void {
    this.updateWorldUC.emitPreUpdateEvent(world, deltaSec);
  }

  notifyUpdate(world: WorldId, deltaSec: Seconds): void {
    this.updateWorldUC.emitUpdateEvent(world, deltaSec);
  }

  notifyPostUpdate(world: WorldId, deltaSec: Seconds): void {
    this.updateWorldUC.emitPostUpdateEvent(world, deltaSec);
  }
}
