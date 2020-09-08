import { Actor, World } from "@curtain-call/actor";

export abstract class Weapon extends Actor {
  /**
   * Start firing.
   *
   * @param world World.
   */
  abstract startFire(world: World): void;

  /**
   * Is firing now.
   *
   * @returns Is firing.
   */
  abstract isFiring(): boolean;

  /**
   * Request stop firing.
   */
  abstract stopFire(): void;

  /**
   * Stop firing process immediately.
   */
  abstract forceStopFire(): void;
}
