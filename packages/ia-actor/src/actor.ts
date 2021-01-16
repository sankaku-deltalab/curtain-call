/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: Delete this disabling later
import { Vector, Matrix } from "trans-vector2d";
import {
  ActorBase,
  WorldBase,
  ActorEvent,
  CollisionRepresentation,
  CollisionGroup,
  Team,
  ActorRole,
  Movement,
  DrawingRepresentation,
  Box2d,
  ActorExtension,
  Timer,
} from "@curtain-call/entity";
import {
  EventEmitter,
  CollisionShape,
  DisplayObject,
} from "@curtain-call/uc-actor";
import { CollisionActor, DrawingActor } from "./actor-subsystem";

export class Actor implements ActorBase {
  private readonly collisionActor: CollisionActor;
  private readonly drawingActor: DrawingActor;
  private readonly event: EventEmitter<ActorEvent>;

  constructor(
    event?: EventEmitter<ActorEvent>,
    collisionActor?: CollisionActor,
    drawingActor?: DrawingActor
  ) {
    if (!(event && collisionActor && drawingActor))
      throw new Error("DI failed");
    this.event = event;
    this.collisionActor = collisionActor.initCollisionActor(this, this.event);
    this.drawingActor = drawingActor?.initDrawingActor(this);
  }

  /**
   * Add event listener.
   *
   * @param event
   * @param listener
   */
  on<T extends keyof ActorEvent>(
    event: T,
    listener: (...args: ActorEvent[T]) => unknown
  ): this {
    throw new Error("not implemented");
  }

  /**
   * Add event listener.
   * Listener would be removed after emitted.
   *
   * @param event
   * @param listener
   */
  once<T extends keyof ActorEvent>(
    event: T,
    listener: (...args: ActorEvent[T]) => unknown
  ): this {
    throw new Error("not implemented");
  }

  /**
   * Remove event listener.
   *
   * @param event
   * @param listener
   */
  off<T extends keyof ActorEvent>(
    event: T,
    listener: (...args: ActorEvent[T]) => unknown
  ): this {
    throw new Error("not implemented");
  }

  /**
   * Get team.
   *
   * @returns My team.
   */
  team(): Team {
    throw new Error("not implemented");
  }

  /**
   * Get role.
   *
   * @returns My role.
   */
  role(): ActorRole {
    throw new Error("not implemented");
  }

  /**
   * Get global position of this.
   *
   * @returns Global position.
   */
  position(): Vector {
    throw new Error("not implemented");
  }

  /**
   * Get global rotation of this.
   *
   * @returns Global rotation.
   */
  rotation(): number {
    throw new Error("not implemented");
  }

  /**
   * Get global scaling of this.
   *
   * @returns Global scaling.
   */
  scale(): Vector {
    throw new Error("not implemented");
  }

  /**
   * Get global transformation matrix of this.
   *
   * @returns Global transformation matrix.
   */
  transformation(): Matrix {
    throw new Error("not implemented");
  }

  /**
   * Add movement for this.
   *
   * @param movement Movement would be added.
   * @returns this.
   */
  addMovement(movement: Movement): this {
    throw new Error("not implemented");
  }

  // drawing

  /**
   * Init displaying.
   *
   * @param args
   * @returns this.
   */
  initDisplaying(args: { displayObjects: Iterable<DisplayObject> }): this {
    this.drawingActor.initDisplaying(args);
    return this;
  }

  /**
   * Set actor visibility.
   *
   * @param visibility
   */
  setVisibility(visibility: boolean): this {
    this.drawingActor.setVisibility(visibility);
    return this;
  }

  /**
   * Calc drawing objects of this.
   *
   * @returns Sprites.
   */
  calcDrawingRepresentations(): readonly Readonly<DrawingRepresentation>[] {
    return this.drawingActor.calcDrawingRepresentations();
  }

  // collision

  /**
   * Calc collision representation of this.
   *
   * @returns Collision Representation.
   */
  calcCollisionRepresentation(): Readonly<CollisionRepresentation> {
    return this.collisionActor.calcCollisionRepresentation();
  }

  /**
   * Notify overlapped with other actor.
   *
   * @param world Our world.
   * @param others Collided Other actors.
   */
  notifyOverlappedWith(world: WorldBase, others: readonly ActorBase[]): void {
    return this.collisionActor.notifyOverlappedWith(world, others);
  }

  /**
   * Initialize collision.
   *
   * @param data ActorCollisionData would be modified.
   * @param args.shapes Shapes used for this.
   * @param args.group Group of this.
   * @param args.isExcess This is excess collision.
   * @returns this
   */
  initCollision(args: {
    shapes: CollisionShape[];
    group: CollisionGroup;
    isExcess: boolean;
  }): this {
    this.collisionActor.initCollision(args);
    return this;
  }

  /**
   * Enable collision.
   */
  enableCollision(): void {
    this.collisionActor.enableCollision();
  }

  /**
   * Disable collision.
   */
  disableCollision(): void {
    this.collisionActor.disableCollision();
  }

  /**
   * Notify added to world.
   * Called from only World.
   *
   * @param world Added World.
   */
  notifyAddedToWorld(world: WorldBase): void {
    throw new Error("not implemented");
  }

  /**
   * Notify removed from world.
   * Called from only World.
   *
   * @param world Removed World.
   */
  notifyRemovedFromWorld(world: WorldBase): void {
    throw new Error("not implemented");
  }

  /**
   * If remove this from world, this function must be true.
   *
   * @param world World.
   * @returns This must be removed from world.
   */
  shouldBeRemovedFromWorld(world: WorldBase): boolean {
    throw new Error("not implemented");
  }

  /**
   * Update this by world.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: WorldBase, deltaSec: number): void {
    throw new Error("not implemented");
    this.drawingActor.updateDisplayObjects(deltaSec);
  }

  /**
   * Get global axis-aligned bounding box of this.
   *
   * @returns Global axis-aligned bounding box.
   */
  bounds(): Box2d {
    throw new Error("not implemented");
  }

  /**
   * Get current health of this.
   *
   * @returns Health.
   */
  health(): number {
    throw new Error("not implemented");
  }

  /**
   * Get current health max of this.
   *
   * @returns Health max.
   */
  healthMax(): number {
    throw new Error("not implemented");
  }

  /**
   * Take damage.
   *
   * @returns Actual damage.
   */
  takeDamage(
    world: WorldBase,
    damage: number,
    damageTypes: readonly string[]
  ): number {
    throw new Error("not implemented");
  }

  /**
   * Get this is dead.
   *
   * @returns This is dead.
   */
  isDead(): boolean {
    throw new Error("not implemented");
  }

  /**
   * Get extensions.
   *
   * @returns Extensions.
   */
  getExtensions(): readonly ActorExtension[] {
    throw new Error("not implemented");
  }

  /**
   * Get only one extension filtered by guard.
   * If this has multiple extension filtered guard, return undefined.
   *
   * @param guard User defined type guard.
   * @returns Extensions.
   */
  getOneExtension<T extends ActorExtension>(
    guard: (ext: ActorExtension) => ext is T
  ): T | undefined {
    throw new Error("not implemented");
  }

  /**
   * Start timer.
   *
   * @param timer
   * @returns this.
   */
  startTimer(timer: Timer): void {
    throw new Error("not implemented");
  }
}
