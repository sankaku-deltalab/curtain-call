import { WorldId, Seconds, WorldsExtensionUpdater } from "@curtain-call/entity";

export class WorldsExtensionUpdaterImpl implements WorldsExtensionUpdater {
  notifyPreUpdate(_world: WorldId, _deltaSec: Seconds): void {
    // do nothing.
  }

  update(_world: WorldId, _deltaSec: Seconds): void {
    // do nothing.
  }

  notifyPostUpdate(_world: WorldId, _deltaSec: Seconds): void {
    // do nothing.
  }
}
