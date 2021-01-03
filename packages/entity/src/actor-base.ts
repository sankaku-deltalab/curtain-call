import { Matrix, Vector } from "trans-vector2d";
import { WorldBase } from "./world-base";
import {
  Movement,
  DrawingObject,
  Box2d,
  CollisionStatus,
  Timer,
} from "./interfaces";
import { ActorExtension } from "./actor-extension";

/**
 * Team.
 */
export enum Team {
  playerSide = "player",
  enemySide = "enemy",
  noSide = "noSide",
}

/**
 * Actor role.
 */
export enum ActorRole {
  character = "character",
  bullet = "bullet",
  misc = "misc",
}

/**
 * `ActorBase` is individual contained in `WorldBase`.
 */
export interface ActorBase {
  /**
   * Get team.
   *
   * @returns My team.
   */
  team(): Team;

  /**
   * Get role.
   *
   * @returns My role.
   */
  role(): ActorRole;

  /**
   * Get global position of this.
   *
   * @returns Global position.
   */
  position(): Vector;

  /**
   * Get global rotation of this.
   *
   * @returns Global rotation.
   */
  rotation(): number;

  /**
   * Get global scaling of this.
   *
   * @returns Global scaling.
   */
  scale(): Vector;

  /**
   * Get global transformation matrix of this.
   *
   * @returns Global transformation matrix.
   */
  transformation(): Matrix;

  /**
   * Add movement for this.
   *
   * @param movement Movement would be added.
   * @returns this.
   */
  addMovement(movement: Movement): this;

  /**
   * Calc drawing objects of this.
   *
   * @returns Sprites.
   */
  calcDrawingObjects(): readonly DrawingObject[];

  /**
   * Calc collision status of this.
   *
   * @returns Collision Status.
   */
  calcCollisionStatus(): CollisionStatus;

  /**
   * Notify overlapped with other actor.
   *
   * @param world Our world.
   * @param others Collided Other actors.
   */
  notifyOverlappedWith(world: WorldBase, others: readonly ActorBase[]): void;

  /**
   * Notify added to world.
   * Called from only World.
   *
   * @param world Added World.
   */
  notifyAddedToWorld(world: WorldBase): void;

  /**
   * Notify removed from world.
   * Called from only World.
   *
   * @param world Removed World.
   */
  notifyRemovedFromWorld(world: WorldBase): void;

  /**
   * If remove this from world, this function must be true.
   *
   * @param world World.
   * @returns This must be removed from world.
   */
  shouldBeRemovedFromWorld(world: WorldBase): boolean;

  /**
   * Update this by world.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: WorldBase, deltaSec: number): void;

  /**
   * Get global axis-aligned bounding box of this.
   *
   * @returns Global axis-aligned bounding box.
   */
  bounds(): Box2d;

  /**
   * Get current health of this.
   *
   * @returns Health.
   */
  health(): number;

  /**
   * Get current health max of this.
   *
   * @returns Health max.
   */
  healthMax(): number;

  /**
   * Take damage.
   *
   * @returns Actual damage.
   */
  takeDamage(
    world: WorldBase,
    damage: number,
    damageTypes: readonly string[]
  ): number;

  /**
   * Get this is dead.
   *
   * @returns This is dead.
   */
  isDead(): boolean;

  /**
   * Get extensions.
   *
   * @returns Extensions.
   */
  getExtensions(): readonly ActorExtension[];

  /**
   * Get only one extension filtered by guard.
   * If this has multiple extension filtered guard, return undefined.
   *
   * @param guard User defined type guard.
   * @returns Extensions.
   */
  getOneExtension<T extends ActorExtension>(
    guard: (ext: ActorExtension) => ext is T
  ): T | undefined;

  /**
   * Start timer.
   *
   * @param timer
   * @returns this.
   */
  startTimer(timer: Timer): void;
}
