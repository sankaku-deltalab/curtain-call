import { World, ActorController } from "../interface";
import { Actor as IActor } from "../actor-interface";

export class ActorWithController {
  private controller: ActorController | undefined;

  /**
   * Get controller.
   * If self is not controlled by ActorController, return undefined.
   *
   * @returns Controller.
   */
  getController(): ActorController | undefined {
    return this.controller;
  }

  /**
   * Set controller.
   *
   * @param controller Controller.
   * @returns this.
   */
  setController(controller: ActorController): this {
    this.controller = controller;
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
    if (this.controller) this.controller.update(world, actor, deltaSec);
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @param world World.
   * @param actor Parent.
   * @returns Self must remove from world.
   */
  shouldBeRemovedFromWorld(world: World, actor: IActor): boolean {
    if (!this.controller) return false;
    return this.controller.shouldBeRemovedFromWorld(world, actor);
  }
}
