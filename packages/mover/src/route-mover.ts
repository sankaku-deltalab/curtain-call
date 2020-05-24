import { Matrix, Vector } from "trans-vector2d";
import { Mover } from "./mover";

export interface MoveRoute<T> {
  /**
   * Get route position and route finished.
   *
   * @param scene Scene.
   * @param elapsedSec Elapsed seconds.
   * @returns Route position and route finished.
   */
  getPosition(
    scene: T,
    elapsedSec: number
  ): { done: boolean; position: Vector };
}

/**
 * Compute movement with route.
 */
export class RouteMover<T> implements Mover<T> {
  private route?: MoveRoute<T>;
  private elapsedSec = 0;
  private isRunning = false;
  private prevPos = Vector.zero;

  /**
   * Start moving.
   *
   * @param route
   * @returns this.
   */
  start(route: MoveRoute<T>): this {
    this.route = route;
    this.elapsedSec = 0;
    this.isRunning = true;
    return this;
  }

  /**
   * Abort moving.
   */
  abort(): void {
    this.isRunning = false;
  }

  /**
   * Update movement and return transformation delta
   *
   * @param scene Scene.
   * @param deltaSec Delta seconds.
   * @param currentTrans Current transform.
   * @returns New transformation and movement was done.
   */
  update(
    scene: T,
    deltaSec: number,
    currentTrans: Matrix
  ): { done: boolean; newTrans: Matrix } {
    if (!this.route || !this.isRunning)
      return { done: true, newTrans: currentTrans };

    const prevTime = this.elapsedSec;
    const nextTime = prevTime + deltaSec;

    const { done, position } = this.route.getPosition(scene, nextTime);
    const delta = position.sub(this.prevPos);

    this.elapsedSec = nextTime;
    this.prevPos = position;
    return { done, newTrans: currentTrans.translated(delta) };
  }
}
