/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: Enable lint later
import { Vector, VectorLike } from "trans-vector2d";
import {
  WorldBase,
  WorldEvent,
  WorldExtension,
  ActorBase,
  Box2d,
  DrawingRepresentation,
} from "@curtain-call/entity";
import { DrawingWorld } from "./world-subsystem";

export class World implements WorldBase {
  private readonly drawingWorld: DrawingWorld;

  constructor(drawingWorld?: DrawingWorld) {
    if (!drawingWorld) throw new Error("DI failed");
    this.drawingWorld = drawingWorld.initDrawingWorld(this);
  }

  /**
   * Add event listener.
   *
   * @param event
   * @param listener
   */
  on<T extends keyof WorldEvent>(
    event: T,
    listener: (...args: WorldEvent[T]) => unknown
  ): this {
    throw new Error("Not implemented");
  }

  /**
   * Add event listener.
   * Listener would be removed after emitted.
   *
   * @param event
   * @param listener
   */
  once<T extends keyof WorldEvent>(
    event: T,
    listener: (...args: WorldEvent[T]) => unknown
  ): this {
    throw new Error("Not implemented");
  }

  /**
   * Remove event listener.
   *
   * @param event
   * @param listener
   */
  off<T extends keyof WorldEvent>(
    event: T,
    listener: (...args: WorldEvent[T]) => unknown
  ): this {
    throw new Error("Not implemented");
  }

  // drawing

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
  ): this {
    throw new Error("Not implemented");
  }

  /**
   * Calc drawing objects.
   *
   * @returns Sprites.
   */
  calcDrawingRepresentations(): readonly Readonly<DrawingRepresentation>[] {
    return this.drawingWorld.calcDrawingRepresentations();
  }

  /**
   * Update this and contained actors.
   *
   * @param deltaSec Update delta seconds.
   */
  update(deltaSec: number): void {
    throw new Error("Not implemented");
  }

  /**
   * Add actor to this.
   *
   * @param actor Adding actor.
   * @returns this.
   */
  addActor(actor: ActorBase): this {
    throw new Error("Not implemented");
  }

  /**
   * Remove added actor from this.
   *
   * @param actor Removing actor.
   * @returns this.
   */
  removeActor(actor: ActorBase): this {
    throw new Error("Not implemented");
  }

  /**
   * Return this has given actor.
   *
   * @param actor Checking actor.
   * @returns This has given actor.
   */
  hasActor(actor: ActorBase): boolean {
    throw new Error("Not implemented");
  }

  /**
   * Iterate added actors.
   *
   * @returns Added actors iterator.
   */
  iterateActors(): IterableIterator<ActorBase> {
    throw new Error("Not implemented");
  }

  /**
   * Calc given axis-aligned bounding box is in core area.
   *
   * @param globalBounds Global AABB.
   * @returns Given AABB is in core area.
   */
  boundsIsInCoreArea(globalBounds: Box2d): boolean {
    throw new Error("Not implemented");
  }

  /**
   * Calc given axis-aligned bounding box is NOT in core area.
   *
   * @param globalBounds Global AABB.
   * @returns Given AABB is NOT in core area.
   */
  boundsIsNotInCoreArea(globalBounds: Box2d): boolean {
    throw new Error("Not implemented");
  }

  /**
   * Get extensions.
   *
   * @returns Extensions.
   */
  getExtensions(): readonly WorldExtension[] {
    throw new Error("Not implemented");
  }

  /**
   * Get only one extension filtered by guard.
   * If this has multiple extension filtered guard, return undefined.
   *
   * @param guard User defined type guard.
   * @returns Extensions.
   */
  getOneExtension<T extends WorldExtension>(
    guard: (ext: WorldExtension) => ext is T
  ): T | undefined {
    throw new Error("Not implemented");
  }

  /**
   * Add hit stop.
   *
   * @param timeScale Time scale while hit stopped.
   * @param realStopDurationSec Duration of hit stopping.
   */
  addHitStop(timeScale: number, realStopDurationSec: number): void {
    throw new Error("Not implemented");
  }

  /**
   * Add time scaling.
   *
   * @param causer Time scaling causer. One causer can add one scaling.
   * @param scale Time scale.
   */
  addTimeScaling(causer: unknown, scale: number): void {
    throw new Error("Not implemented");
  }

  /**
   * Remove added time scaling.
   *
   * @param causer Time scaling causer. One causer can add one scaling.
   */
  removeTimeScaling(causer: unknown): void {
    throw new Error("Not implemented");
  }
}
