import { World, ActorController } from "../interface";

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
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void {
    if (this.controller) this.controller.update(world, deltaSec);
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @param world World.
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(world: World): boolean {
    if (!this.controller) return false;
    return this.controller.shouldRemoveSelfFromWorld(world);
  }
}
