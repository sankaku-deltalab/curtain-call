import { Actor } from "../actor";

export interface ActorController {
  /**
   * Get controlling actor.
   */
  getActor(): Actor;

  /**
   * Set controlling actor.
   *
   * @param actor Actor.
   * @returns this.
   */
  ownActor(actor: Actor): this;
}
