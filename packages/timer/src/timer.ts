import { World, Timer as ITimer } from "@curtain-call/actor";

/**
 * Timer.
 *
 * @example
 * const timer = new Timer(false, 0.5, (world, wastedSec) => {
 *   // do something.
 * });
 *
 * actor.addTimer(timer);
 */
export class Timer implements ITimer {
  private elapsedSec = 0;
  private active = true;

  constructor(
    private readonly loop: boolean,
    private readonly durationSec: number,
    private readonly callback: (world: World, wastedSec: number) => void
  ) {}

  /**
   * Timer is active.
   *
   * @returns Timer is active.
   */
  isActive(): boolean {
    return this.active;
  }

  /**
   * Deactivate timer.
   *
   * @returns this.
   */
  deactivate(): this {
    this.active = false;
    return this;
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @returns Self must remove from world.
   */
  shouldBeRemovedFromWorld(): boolean {
    return !this.active;
  }

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void {
    this.elapsedSec += deltaSec;
    while (this.active && this.elapsedSec >= this.durationSec) {
      this.elapsedSec -= this.durationSec;
      this.callback(world, this.elapsedSec);
      if (!this.loop) this.active = false;
    }
  }
}
