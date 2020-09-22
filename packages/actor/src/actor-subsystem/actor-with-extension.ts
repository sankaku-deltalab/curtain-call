import { World, ActorExtension } from "../interface";
import { Actor as IActor } from "../actor-interface";

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
}
