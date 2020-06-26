import { Actor } from "@curtain-call/actor";
import { World } from "@curtain-call/world";
import { Asset } from "@curtain-call/asset";
import { Level } from "@curtain-call/level";

export class StaticLevel<T extends World> implements Level<T> {
  private activated = false;
  private actors: readonly Actor<T>[] = [];

  constructor(
    private readonly assets: readonly Asset[],
    private readonly actorsGenerator: (world: T) => readonly Actor<T>[]
  ) {}

  /**
   * Load assets.
   *
   * @returns Loading Promise.
   */
  async load(): Promise<void> {
    const loading = this.assets.map((asset) => asset.load());
    await Promise.all(loading);
  }

  /**
   * Unload assets.
   *
   * @param exclude Excluding assets.
   */
  unload(exclude?: ReadonlySet<Asset>): void {
    this.assets.forEach((asset) => {
      if (exclude && exclude.has(asset)) return;
      asset.unload();
    });
  }

  /**
   * Assets was loaded.
   *
   * @returns Assets was loaded.
   */
  isLoaded(): boolean {
    return this.assets.every((asset) => asset.isLoaded());
  }

  /**
   * Activate level.
   *
   * @param world World.
   */
  activate(world: T): void {
    if (this.activated) return;
    this.activated = true;
    this.actors = this.actorsGenerator(world);
    this.actors.forEach((actor) => {
      world.addActor(actor);
      actor.trans.attachTo(world.backgroundTrans);
    });
  }

  /**
   * Deactivate level.
   *
   * @param world
   */
  deactivate(world: T): void {
    if (!this.activated) return;
    this.activated = false;
    this.actors.forEach((actor) => {
      world.removeActor(actor);
      actor.trans.detachFromParent();
    });
  }

  /**
   * Level is activated.
   *
   * @returns Level is activated.
   */
  isActive(): boolean {
    return this.activated;
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @param _world World.
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(_world: T): boolean {
    return false;
  }

  /**
   * Update level.
   *
   * @param _world World.
   * @param _deltaSec Delta seconds.
   */
  update(_world: T, _deltaSec: number): void {
    // do nothing
  }
}
