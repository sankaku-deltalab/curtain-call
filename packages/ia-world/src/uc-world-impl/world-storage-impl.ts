import { injectable } from "@curtain-call/shared-dependencies";
import { WorldId } from "@curtain-call/entity";
import { WorldStorage } from "@curtain-call/uc-world";
import { World } from "../world";

@injectable()
export class WorldStorageImpl implements WorldStorage<World> {
  private readonly worlds = new Map<WorldId, World>();

  addWorld(worldInstance: World): void {
    if (this.worlds.has(worldInstance.id))
      throw new Error("World is already added");

    this.worlds.set(worldInstance.id, worldInstance);
  }

  getWorldInstance(world: WorldId): World | undefined {
    return this.worlds.get(world);
  }

  removeWorld(world: WorldId): void {
    this.worlds.delete(world);
  }
}
