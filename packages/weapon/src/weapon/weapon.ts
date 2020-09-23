import { ActorExtension, World } from "@curtain-call/actor";

export interface Weapon extends ActorExtension {
  /**
   * Start firing.
   *
   * @param world World.
   */
  startFire(world: World): void;

  /**
   * Is firing now.
   *
   * @returns Is firing.
   */
  isFiring(): boolean;

  /**
   * Request stop firing.
   */
  stopFire(): void;

  /**
   * Stop firing process immediately.
   */
  forceStopFire(): void;
}
