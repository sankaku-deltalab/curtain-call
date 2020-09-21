import { Matrix, VectorLike } from "trans-vector2d";

import { container as diContainer } from "tsyringe";

import {
  World,
  Collision,
  DisplayObject,
  Mover,
  CollisionShape,
  CollisionGroup,
  ActorController,
  Transformation,
  Timer,
  EventEmitter as IEventEmitter,
} from "./interface";

export { diContainer };

export interface DamageType {
  name: string;
}

export enum Team {
  playerSide = "player",
  enemySide = "enemy",
  noSide = "noSide",
}
export enum ActorRole {
  character = "character",
  bullet = "bullet",
  visual = "visual",
  misc = "misc",
}
export type ActorEvent = IEventEmitter<{
  addedToWorld: [World];
  removedFromWorld: [World];
  updated: [World, number];
  overlapped: [World, Set<Actor>];
  takenDamage: [World, number, Actor, DamageType];
  dead: [World, Actor, DamageType];
  beHealed: [World, number];
  dealDamage: [World, number, Actor, DamageType];
  killed: [World, Actor, DamageType];
}>;

/**
 * Actor is individual in world.
 */
export interface Actor {
  /** Event. */
  readonly event: ActorEvent;

  /**
   * Get controller.
   * If self is not controlled by ActorController, return undefined.
   *
   * @returns Controller.
   */
  getController(): ActorController | undefined;

  /**
   * Set controller.
   *
   * @param controller Controller.
   * @returns this.
   */
  setController(controller: ActorController): this;

  /**
   * Add timer.
   *
   * @param timer
   * @returns this.
   */
  addTimer(timer: Timer): this;

  /**
   * Remove timer.
   *
   * @param timer
   * @returns this.
   */
  removeTimer(timer: Timer): this;

  /**
   * Move to specified position.
   *
   * @param pos New position on local space. Not delta.
   * @returns this.
   */
  moveTo(pos: VectorLike): this;

  /**
   * Rotate to specified angle.
   *
   * @param angle New angle. Not delta.
   * @returns this.
   */
  rotateTo(angle: number): this;

  /**
   * Set local transform.
   *
   * @param newLocalTrans New local transform.
   * @returns this.
   */
  setLocalTransform(newLocalTrans: Matrix): this;

  /**
   * Swap local transform.
   *
   * @param swapper Function given current transform and return new transform.
   * @returns this.
   */
  swapLocalTransform(swapper: (current: Matrix) => Matrix): this;

  /**
   * Get Transformation of self.
   *
   * @returns Transformation of self.
   */
  getTransformation(): Transformation;

  /**
   * Attach other actor to self.
   *
   * @param child Attaching child Actor.
   * @param keepWorldTransform When attached, keep world transform of child.
   * @returns this.
   */
  attachActor(child: Actor, keepWorldTransform: boolean): this;

  /**
   * Attach other Transformation to self.
   *
   * @param child Attaching child Transformation.
   * @param keepWorldTransform When attached, keep world transform of child.
   * @returns this.
   */
  attachTransformation(
    child: Transformation,
    keepWorldTransform: boolean
  ): this;

  /**
   * Detach child Actor from self.
   *
   * @param child Detaching child Actor.
   * @param keepWorldTransform When detached, keep world transform of child.
   * @return this.
   */
  detachActor(child: Actor, keepWorldTransform: boolean): this;

  /**
   * Detach child Actor from self.
   *
   * @param child Detaching child Transformation.
   * @param keepWorldTransform When detached, keep world transform of child.
   * @return this.
   */
  detachTransformation(
    child: Transformation,
    keepWorldTransform: boolean
  ): this;

  /**
   * Add mover.
   *
   * @param mover Adding mover.
   * @returns this.
   */
  addMover(mover: Mover): this;

  /**
   * Remove mover.
   *
   * @param mover Removing mover.
   * @returns this.
   */
  removeMover(mover: Mover): this;

  /**
   * Remove self from world at next world update.
   *
   * @returns this.
   */
  reserveRemovingSelfFromWorld(): this;

  /**
   * Cancel removing self from world at next world update.
   *
   * @returns this.
   */
  cancelRemovingSelfFromWorld(): this;

  /**
   * If remove self from world, this function must be true.
   *
   * @param world World.
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(world: World): boolean;

  /**
   * Notify added to world.
   * Called from only World.
   *
   * @param world Added World.
   */
  notifyAddedToWorld(world: World): void;

  /**
   * Notify removed from world.
   * Called from only World.
   *
   * @param world Removed World.
   */
  notifyRemovedFromWorld(world: World): void;

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void;

  /**
   * Set life time.
   * When life time was over, this should remove self from world.
   *
   * @param lifeTimeSec Life time in seconds.
   * @returns this.
   */
  setLifeTime(lifeTimeSec: number): this;

  /**
   * Add collision shape.
   *
   * @param shape Adding collision shape.
   * @returns this.
   */
  addCollisionShape(shape: CollisionShape): this;

  /**
   * Remove collision shape.
   *
   * @param shape Removing collision shape.
   * @returns this.
   */
  removeCollisionShape(shape: CollisionShape): this;

  /**
   * Set self is huge number collision.
   *
   * Huge number collision will collide with only non-huge number collisions.
   *
   * @param isHuge
   * @return this.
   */
  setCollisionAsHugeNumber(isHuge: boolean): this;

  /**
   * Set this CollisionGroup.
   *
   * @param newGroup New group of this.
   * @returns this.
   */
  setCollisionGroup(newGroup: CollisionGroup): this;

  /**
   * Set collision enable.
   *
   * @param newEnable Enabling.
   * @returns this.
   */
  setCollisionEnable(newEnable: boolean): this;

  /**
   * Get this collision.
   *
   * @returns This collision.
   */
  getCollision(): Collision;

  /**
   * Notify overlapped with other actor.
   *
   * @param world Our world.
   * @param others Collided Other actors.
   */
  notifyOverlappedWith(world: World, others: Set<Actor>): void;

  /**
   * Add display object.
   *
   * @param obj Adding display object.
   * @returns this.
   */
  addDisplayObject(obj: DisplayObject): this;

  /**
   * Remove display object.
   *
   * @param obj Removing display object.
   * @returns this.
   */
  removeDisplayObject(obj: DisplayObject): this;

  /**
   * Iterate containing display objects.
   *
   * @param callback
   */
  iterateDisplayObject(callback: (obj: DisplayObject) => void): void;

  /**
   * Init health and healthMax.
   *
   * @param health Initial health.
   * @param health HealthMax.
   * @returns this.
   */
  initHealth(health: number, healthMax: number): this;

  /**
   * Current health.
   *
   * @returns Current health.
   */
  health(): number;

  /**
   * Max health.
   *
   * @returns Max health.
   */
  healthMax(): number;

  /**
   * Return self is dead.
   *
   * @returns Self is dead.
   */
  isDead(): boolean;

  /**
   * Take damage to this.
   *
   * @param world World.
   * @param damage Damage amount.
   * @param dealer Damage dealer.
   * @param type Damage type.
   * @returns Damage taking result.
   */
  takeDamage(
    world: World,
    damage: number,
    dealer: Actor,
    type: DamageType
  ): { actualDamage: number; died: boolean };

  /**
   * Kill self.
   *
   * @param world World.
   * @param dealer Death dealer.
   * @param type Damage type.
   */
  killSelf(world: World, dealer: Actor, type: DamageType): { died: boolean };

  /**
   * Heal health.
   *
   * @param world World.
   * @param amount Healing amount.
   */
  heal(world: World, amount: number): { actualHealed: number };

  /**
   * Deal damage to other actor.
   *
   * @param world Our world.
   * @param damage Dealing damage.
   * @param taker Damaged actor.
   * @param type Damage type.
   */
  dealDamage(
    world: World,
    damage: number,
    taker: Actor,
    type: DamageType
  ): { actualDamage: number; killed: boolean };

  /**
   * Kill other actor.
   *
   * @param world Our world.
   * @param taker Damaged actor.
   * @param type Damage type.
   */
  killOther(world: World, taker: Actor, type: DamageType): { killed: boolean };

  /**
   * Notify this dealt damage to other.
   *
   * @param world Our world.
   * @param damage Dealt damage (not original damage).
   * @param taker Damaged Health.
   * @param type Damage type.
   */
  notifyDealtDamage(
    world: World,
    damage: number,
    taker: Actor,
    type: DamageType
  ): void;

  /**
   * Notify this kill other.
   *
   * @param world Our world.
   * @param taker Damaged Actor.
   * @param type Damage type.
   */
  notifyKilled(world: World, taker: Actor, type: DamageType): void;

  /**
   * Set team joined this.
   *
   * @param team New team.
   * @returns this.
   */
  setTeam(team: Team): this;

  /**
   * Get team joined this.
   *
   * @returns Team.
   */
  getTeam(): Team;

  /**
   * Set ActorRole.
   *
   * @param role ActorRole of self.
   * @returns this.
   */
  setRole(role: ActorRole): this;

  /**
   * Get ActorRole of self.
   *
   * @returns ActorRole of self.
   */
  getRole(): ActorRole;

  /**
   * Add sub actor to this.
   * Sub actor would be attached to this.
   *
   * @param addingSubActor Adding actors.
   * @returns this.
   */
  addSubActor(...addingSubActor: Actor[]): this;

  /**
   * Remove sub actor from this.
   * Sub actor would be detach from parent.
   *
   * @param removingSubActor Removing actors.
   * @returns this.
   */
  removeSubActor(...removingSubActor: Actor[]): this;

  /**
   * Get sub-actors.
   */
  getSubActors(): Actor[];
}
