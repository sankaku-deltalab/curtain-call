import { World, ActorExtension } from "../interface";
import { Actor as IActor, DamageType } from "../actor-interface";

export class ActorWithExtension {
  private readonly extensions: ActorExtension[] = [];

  /**
   * Get extensions.
   *
   * @returns Extensions.
   */
  getExtensions(): ActorExtension[] {
    return [...this.extensions];
  }

  /**
   * Get only one extension filtered by guard.
   * If this has multiple extension filtered guard, return undefined.
   *
   * @param guard User defined type guard.
   * @returns Extensions.
   */
  getOneExtension<T extends ActorExtension>(
    guard: (ext: ActorExtension) => ext is T
  ): T | undefined {
    const extensions = this.extensions.filter(guard);
    if (extensions.length === 1) return extensions[0];
    return undefined;
  }

  /**
   * Add extension.
   *
   * @param extension Adding extension.
   * @param actor Parent.
   * @returns this.
   */
  addExtension(extension: ActorExtension, actor: IActor): this {
    this.extensions.push(extension);
    extension.notifyAddedToActor(actor);
    return this;
  }

  /**
   * Update self.
   *
   * @param world World.
   * @param actor Parent.
   * @param deltaSec Delta seconds.
   */
  update(world: World, actor: IActor, deltaSec: number): void {
    this.extensions.forEach((ex) => ex.update(world, actor, deltaSec));
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @param world World.
   * @param actor Parent.
   * @returns Self must remove from world.
   */
  shouldBeRemovedFromWorld(world: World, actor: IActor): boolean {
    return this.extensions.some((ex) =>
      ex.shouldBeRemovedFromWorld(world, actor)
    );
  }

  /**
   * Calculate taken damage multiplier.
   *
   * @param world World.
   * @param damage Original damage amount.
   * @param dealer Damage dealer.
   * @param actor Damage taking actor.
   * @param type Damage type.
   * @returns Damage multiplier.
   */
  calcTakingDamageMultiplier(
    world: World,
    damage: number,
    dealer: IActor,
    actor: IActor,
    type: DamageType
  ): number {
    return this.getExtensions().reduce(
      (mlt, ext) =>
        mlt *
        ext.calcTakingDamageMultiplier(world, damage, dealer, actor, type),
      1
    );
  }
}
