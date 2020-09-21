import { World, Timer } from "../interface";

export class ActorWithTimer {
  private readonly timers = new Set<Timer>();

  /**
   * Add timer.
   *
   * @param timer
   * @returns this.
   */
  addTimer(timer: Timer): this {
    this.timers.add(timer);
    return this;
  }

  /**
   * Remove timer.
   *
   * @param timer
   * @returns this.
   */
  removeTimer(timer: Timer): this {
    this.timers.delete(timer);
    return this;
  }

  /**
   * Update timers.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void {
    this.timers.forEach((timer) => timer.update(world, deltaSec));
    this.timers.forEach((timer) => {
      if (timer.isActive()) return;
      this.timers.delete(timer);
    });
  }
}
