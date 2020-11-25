import { Vector, VectorLike } from "trans-vector2d";
import { ActorBase } from "./actor-base";
import { Box2d } from "./interfaces";

/**
 * `WorldBase` is container for `ActorBase`.
 */
export interface WorldBase {
  /**
   * Set canvas drawing method.
   *
   * @example
   * const gameSize = new Vector(300, 400);
   * world.setDrawAreaUpdater((renderingSize) => {
   *   const gameUnitPerPixel =
   *     Math.max(gameSize.x / renderingSize.x, gameSize.y / gameSize.y) * 1.25;
   *   const gameSizeInRendering = gameSize.div(gameUnitPerPixel);
   *   return {
   *     drawCenterInRendering: { x: renderingSize.x / 2, y: gameSizeInRendering.y / 2 },
   *     drawSizeInRendering: gameSizeInRendering,
   *     gameUnitPerPixel,
   *   };
   * });
   *
   * @param updater Drawing area updater. Called at every pre update.
   * @returns this.
   */
  setDrawAreaUpdater(
    updater: (
      renderingSize: Vector
    ) => {
      drawCenterInRendering: VectorLike;
      drawSizeInRendering: VectorLike;
      gameUnitPerPixel: number;
    }
  ): this;

  /**
   * Update this and contained actors.
   *
   * @param deltaSec Update delta seconds.
   */
  update(deltaSec: number): void;

  /**
   * Add actor to this.
   *
   * @param actor Adding actor.
   * @returns this.
   */
  addActor(actor: ActorBase): this;

  /**
   * Remove added actor from this.
   *
   * @param actor Removing actor.
   * @returns this.
   */
  removeActor(actor: ActorBase): this;

  /**
   * Return this has given actor.
   *
   * @param actor Checking actor.
   * @returns This has given actor.
   */
  hasActor(actor: ActorBase): boolean;

  /**
   * Iterate added actors.
   *
   * @returns Added actors iterator.
   */
  iterateActors(): IterableIterator<ActorBase>;

  /**
   * Calc given axis-aligned bounding box is in core area.
   *
   * @param globalAABB Global AABB.
   * @returns Given AABB is in core area.
   */
  aabbIsInCoreArea(globalAABB: Box2d): boolean;

  /**
   * Calc given axis-aligned bounding box is NOT in core area.
   *
   * @param globalAABB Global AABB.
   * @returns Given AABB is NOT in core area.
   */
  aabbIsNotInCoreArea(globalAABB: Box2d): boolean;

  /**
   * Add hit stop.
   *
   * @param timeScale Time scale while hit stopped.
   * @param realStopDurationSec Duration of hit stopping.
   */
  addHitStop(timeScale: number, realStopDurationSec: number): void;

  /**
   * Add time scaling.
   *
   * @param causer Time scaling causer. One causer can add one scaling.
   * @param scale Time scale.
   */
  addTimeScaling(causer: unknown, scale: number): void;

  /**
   * Remove added time scaling.
   *
   * @param causer Time scaling causer. One causer can add one scaling.
   */
  removeTimeScaling(causer: unknown): void;
}
