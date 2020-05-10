import { Matrix } from "trans-vector2d";
import { Mover } from "./mover";

export interface MoveRoute<T, A> {
  getTransformationAt(
    scene: T,
    secondsFromStart: number,
    moving: A
  ): { done: boolean; mat: Matrix };
}

/**
 * Compute movement with route.
 */
export class RouteMover<T, A> implements Mover<T, A> {
  private route?: MoveRoute<T, A>;
  private secondsFromStart = 0;
  private isRunning = false;
  private prevMat = Matrix.identity;

  /**
   * Start moving.
   *
   * @param route
   * @returns this.
   */
  start(route: MoveRoute<T, A>): this {
    this.route = route;
    this.secondsFromStart = 0;
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
   * @param moving Moving Actor.
   * @returns Transformation delta.
   */
  update(
    scene: T,
    deltaSec: number,
    moving: A
  ): { done: boolean; deltaMat: Matrix } {
    if (!this.route || !this.isRunning)
      return { done: true, deltaMat: Matrix.identity };

    const prevTime = this.secondsFromStart;
    const nextTime = prevTime + deltaSec;

    const { done, mat } = this.route.getTransformationAt(
      scene,
      nextTime,
      moving
    );
    const deltaMat = this.prevMat.localize(mat);

    this.secondsFromStart = nextTime;
    this.prevMat = mat;
    if (done) {
      this.isRunning = false;
    }
    return { done, deltaMat };
  }
}
