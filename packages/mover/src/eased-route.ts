import { Vector, VectorLike } from "trans-vector2d";
import EasingFunction from "bezier-easing";
import { World } from "@curtain-call/actor";
import { MoveRoute } from "./route-mover";

/**
 * Eased moving route.
 *
 * @example
 * const route = new EasedRoute().init({ x: 0, y: -50 }, 1, EasedRoute.easeIn);
 */
export class EasedRoute implements MoveRoute {
  private destination = Vector.zero;
  private durationSec = 0;
  private easer: (p: number) => number = EasedRoute.linear;

  static readonly linear = EasingFunction(0, 0, 1, 1);
  static readonly easeIn = EasingFunction(0.42, 0, 1, 1);
  static readonly easeOut = EasingFunction(0, 0, 0.58, 1);
  static readonly easeInOut = EasingFunction(0.42, 0, 0.58, 1);

  /**
   * Init route.
   *
   * @example
   * const route = new EasedRoute().init({ x: 0, y: -50 }, 1, EasedRoute.easeIn);
   * @param destination Route terminal.
   * @param durationSec Moving duration.
   * @param easer Moving easer.
   */
  init(
    destination: VectorLike,
    durationSec: number,
    easer: (p: number) => number
  ): this {
    this.destination = Vector.from(destination);
    this.durationSec = durationSec;
    this.easer = easer;
    return this;
  }

  /**
   * Get route position and route finished.
   *
   * @param world World.
   * @param elapsedSec Elapsed seconds.
   * @returns Route position and route finished.
   */
  getPosition(
    world: World,
    elapsedSec: number
  ): { done: boolean; position: Vector } {
    const p = Math.max(0, Math.min(1, elapsedSec / this.durationSec));
    return {
      done: p === 1,
      position: this.destination.mlt(this.easer(p)),
    };
  }
}
