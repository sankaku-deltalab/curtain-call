import { DamageDealer } from "@curtain-call/health";

export interface WeaponActor<TWorld> {
  startFiring(world: TWorld): this;
  stopFiring(): this;
  forceStopFiring(): this;
  isFiring(): boolean;
}

export interface Weapon<T, A> {
  /** Damage dealer. */
  readonly damageDealer: DamageDealer<T, A>;

  /**
   * Start firing.
   *
   * @param world World.
   */
  start(world: T): void;

  /**
   * Is firing now.
   *
   * @returns Is firing.
   */
  isFiring(): boolean;

  /**
   * Request stop firing.
   */
  stop(): void;

  /**
   * Stop firing process immediately.
   */
  forceStop(): void;

  /**
   * Update firing process.
   *
   * @param _world World.
   * @param deltaSec Delta seconds.
   */
  update(world: T, deltaSec: number): void;
}
