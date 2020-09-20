import { VectorLike, Vector } from "trans-vector2d";
import * as PIXI from "pixi.js";
import { Engine } from "./engine";
import { Camera } from "./camera";
import { Actor as IActor } from "../actor-interface";
import { Updatable } from "./updatable";
import { EventEmitter } from "./event-emitter";
import { PointerInputReceiver } from "./pointer-input-receiver";

export enum PositionInAreaStatus {
  inArea = "inArea",
  onAreaEdge = "onAreaEdge",
  outOfArea = "outOfArea",
}

/**
 * World is root of game world.
 */
export interface World {
  /** Event. */
  readonly event: EventEmitter<{
    updated: [number];
  }>;

  readonly pixiHead: PIXI.Container;
  readonly pixiTail: PIXI.Container;

  /**
   * Set canvas drawing method.
   *
   * @example
   * const gameSize = new Vector(300, 400);
   * const world = new World().setDrawAreaUpdater((canvasSize) => {
   *   const gameUnitPerPixel =
   *     Math.max(gameSize.x / canvasSize.x, gameSize.y / gameSize.y) * 1.25;
   *   const gameSizeInCanvas = gameSize.div(gameUnitPerPixel);
   *   return {
   *     drawCenterInCanvas: { x: canvasSize.x / 2, y: gameSizeInCanvas.y / 2 },
   *     drawSizeInCanvas: gameSizeInCanvas,
   *     gameUnitPerPixel,
   *   };
   * });
   * @param updater Drawing area updater. Called at every pre update.
   * @returns this.
   */
  setDrawAreaUpdater(
    updater: (
      canvasSize: Vector
    ) => {
      drawCenterInCanvas: VectorLike;
      drawSizeInCanvas: VectorLike;
      gameUnitPerPixel: number;
    }
  ): this;

  /**
   * Get world camera.
   */
  getCamera(): Camera;

  /**
   * Update this and contained Updatable object.
   *
   * @param engine Engine owning self.
   * @param deltaSec Update delta seconds.
   */
  update(engine: Engine, deltaSec: number): void;

  /**
   * Add actor to this.
   *
   * @param actor Adding actor.
   * @returns this.
   */
  addActor(actor: IActor): this;

  /**
   * Remove added actor from this.
   *
   * @param actor Removing actor.
   * @returns this.
   */
  removeActor(actor: IActor): this;

  /**
   * Return this has given actor.
   *
   * @param actor Checking actor.
   * @returns This has given actor.
   */
  hasActor(actor: IActor): boolean;

  /**
   * Iterate added actors.
   *
   * @returns Added actors iterator.
   */
  iterateActors(): IterableIterator<IActor>;

  /**
   * Add Updatable object.
   *
   * @warn Do not add `Actor`. Use `addActor` instead.
   * @param updatable Adding Updatable object.
   * @returns this.
   */
  addUpdatable(updatable: Updatable): this;

  /**
   * Remove Updatable object.
   *
   * @warn Do not remove `Actor`. Use `removeActor` instead.
   * @param updatable Removing Updatable object.
   * @returns this.
   */
  removeUpdatable(updatable: Updatable): this;

  /**
   * Add pointer input receiver.
   *
   * @param receiver
   * @returns this.
   */
  addPointerInputReceiver(receiver: PointerInputReceiver): this;

  /**
   * Remove pointer input receiver.
   *
   * @param receiver
   * @returns this.
   */
  removePointerInputReceiver(receiver: PointerInputReceiver): this;

  /**
   * get pointer input receiver.
   *
   * @returns Receiver.
   */
  getPointerInputReceiver(): PointerInputReceiver;

  /**
   * Convert canvas position to game position.
   *
   * @param canvasPos Canvas position.
   * @returns Game position.
   */
  canvasPosToGamePos(canvasPos: VectorLike): Vector;

  /**
   * Convert game position to canvas position.
   *
   * @param gamePos Game position.
   * @returns Canvas position.
   */
  gamePosToCanvasPos(gamePos: VectorLike): Vector;

  /**
   * Set core area.
   *
   * @param nw NW point on this.trans.
   * @param se SE point on this.trans.
   * @returns this.
   */
  setCoreArea(nw: VectorLike, se: VectorLike): this;

  /**
   * Calc position status for core area.
   *
   * @param globalPos Target position in global coordinates.
   * @param radius Target radius.
   * @returns Status.
   */
  calcPositionStatusWithCoreArea(
    globalPos: VectorLike,
    radius: number
  ): PositionInAreaStatus;
}
