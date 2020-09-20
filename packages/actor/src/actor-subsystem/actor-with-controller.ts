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
}
