import EventEmitter from "eventemitter3";
import { Vector } from "trans-vector2d";
import { World } from "./world";

/**
 * Engine is root of system.
 *
 * This class create pixi application and use it.
 */
export interface Engine {
  /** Event. */
  readonly event: EventEmitter<{
    updated: [number];
  }>;

  // private readonly app: PIXI.Application;
  // private readonly worlds = new Set<World>();
  // private readonly pointerInputConnectors = new Map<
  //   World,
  //   PointerInputConnector<World>
  // >();

  /**
   * Canvas size.
   *
   * @returns Canvas size { x: width, y: height}.
   */
  canvasSize(): Vector;

  /**
   * Add new world.
   * Added world would be updated and rendered.
   *
   * @param world New World.
   * @returns this
   */
  addWorld(world: World): this;

  /**
   * Remove added world.
   *
   * @param world Added world.
   * @returns this
   */
  removeWorld(world: World): this;

  /**
   * Destroy this.
   * Do not use this after destroyed.
   * But added worlds would be still alive.
   */
  destroy(): void;
}
