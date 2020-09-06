import { Matrix, VectorLike } from "trans-vector2d";
import { inject, autoInjectable, container as diContainer } from "tsyringe";
import {
  World,
  FiniteResource,
  Collision,
  DisplayObject,
  Mover,
  CollisionShape,
  CollisionGroup,
  ActorController,
  Transformation,
  Updatable,
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

type ActorEvent = IEventEmitter<{
  // world
  addedToWorld: [World];
  removedFromWorld: [World];
  updated: [World, number];
  // collision
  overlapped: [World, Set<Actor>];
  // health
  takenDamage: [World, number, Actor, DamageType];
  dead: [World, Actor, DamageType];
  beHealed: [World, number];
  // damage dealer
  dealDamage: [World, number, Actor, DamageType];
  killed: [World, Actor, DamageType];
}>;

/**
 * Actor is individual in world.
 */
@autoInjectable()
export class Actor implements Updatable {
  /** Event. */
  public readonly event: ActorEvent;

  private readonly trans: Transformation;
  private readonly healthComponent: FiniteResource;
  private readonly collision: Collision;
  private readonly objects = new Set<DisplayObject>();
  private readonly movers = new Set<Mover>();
  private controller: ActorController | undefined;
  private team = Team.noSide;
  private role = ActorRole.misc;
  private ownerActor?: Actor;
  private subActors = new Set<Actor>();
  private lifeTimeSec?: number;
  private shouldRemoveSelf = false;

  constructor(
    @inject("EventEmitter") event?: ActorEvent,
    @inject("Transformation") trans?: Transformation,
    @inject("FiniteResource") health?: FiniteResource,
    @inject("Collision") collision?: Collision
  ) {
    if (!(event && trans && health && collision))
      throw new Error("DI object is not exist");
    this.event = event;
    this.trans = trans;
    this.healthComponent = health.init(0, 0);
    this.collision = collision;
    this.attachTransformation(collision.trans, false);
  }

  /**
   * Get controller.
   * If self is not controlled by ActorController, return undefined.
   *
   * @returns Controller.
   */
  getController(): ActorController | undefined {
    return this.controller;
  }

  /**
   * Set controller.
   *
   * @param controller Controller.
   * @returns this.
   */
  notifyControlledBy(controller: ActorController): this {
    this.controller = controller;
    return this;
  }

  // about transform

  /**
   * Move to specified position.
   *
   * @param pos New position on local space. Not delta.
   * @returns this.
   */
  moveTo(pos: VectorLike): this {
    const { rotation, scale } = this.trans.getLocal().decompose();
    this.trans.setLocal(Matrix.from({ translation: pos, rotation, scale }));
    return this;
  }

  /**
   * Rotate to specified angle.
   *
   * @param angle New angle. Not delta.
   * @returns this.
   */
  rotateTo(angle: number): this {
    const { translation, scale } = this.trans.getLocal().decompose();
    this.trans.setLocal(Matrix.from({ translation, rotation: angle, scale }));
    return this;
  }

  /**
   * Set local transform.
   *
   * @param newLocalTrans New local transform.
   * @returns this.
   */
  setLocalTransform(newLocalTrans: Matrix): this {
    this.trans.setLocal(newLocalTrans);
    return this;
  }

  /**
   * Get Transformation of self.
   *
   * @returns Transformation of self.
   */
  getTransformation(): Transformation {
    return this.trans;
  }

  /**
   * Attach other actor to self.
   *
   * @param child Attaching child Actor.
   * @param keepWorldTransform When attached, keep world transform of child.
   * @returns this.
   */
  attachActor(child: Actor, keepWorldTransform: boolean): this {
    return this.attachTransformation(child.trans, keepWorldTransform);
  }

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
  ): this {
    this.trans.attachChild(child, keepWorldTransform);
    return this;
  }

  /**
   * Detach child Actor from self.
   *
   * @param child Detaching child Actor.
   * @param keepWorldTransform When detached, keep world transform of child.
   * @return this.
   */
  detachActor(child: Actor, keepWorldTransform: boolean): this {
    return this.detachTransformation(
      child.getTransformation(),
      keepWorldTransform
    );
  }

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
  ): this {
    this.trans.detachChild(child, keepWorldTransform);
    return this;
  }

  /**
   * Add mover.
   *
   * @param mover Adding mover.
   * @returns this.
   */
  addMover(mover: Mover): this {
    this.movers.add(mover);
    return this;
  }

  /**
   * Remove mover.
   *
   * @param mover Removing mover.
   * @returns this.
   */
  removeMover(mover: Mover): this {
    this.movers.delete(mover);
    return this;
  }

  /**
   * Update movement and return transformation delta
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   * @param currentTrans Current transform.
   * @returns New transformation and movement was done.
   */
  protected updateMovement(
    world: World,
    deltaSec: number,
    currentTrans: Matrix
  ): {
    done: boolean;
    newTrans: Matrix;
  } {
    const movers = Array.from(this.movers);
    const result = movers.reduce(
      (prev, mov) => {
        const r = mov.update(world, deltaSec, prev.newTrans);
        return {
          done: prev.done && r.done,
          newTrans: r.newTrans,
        };
      },
      { done: true, newTrans: currentTrans }
    );
    return result;
  }

  // about world

  /**
   * Remove self from world at next world update.
   *
   * @returns this.
   */
  reserveRemovingSelfFromWorld(): this {
    this.shouldRemoveSelf = true;
    return this;
  }

  /**
   * Cancel removing self from world at next world update.
   *
   * @returns this.
   */
  cancelRemovingSelfFromWorld(): this {
    this.shouldRemoveSelf = false;
    return this;
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @param world World.
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(): boolean {
    const lifeTimeIsOver =
      this.lifeTimeSec !== undefined && this.lifeTimeSec <= 0;
    return this.shouldRemoveSelf || lifeTimeIsOver;
  }

  /**
   * Notify added to world.
   * Called from only World.
   *
   * @param world Added World.
   */
  notifyAddedToWorld(world: World): void {
    this.event.emit("addedToWorld", world);
  }

  /**
   * Notify removed from world.
   * Called from only World.
   *
   * @param world Removed World.
   */
  notifyRemovedFromWorld(world: World): void {
    this.event.emit("removedFromWorld", world);
  }

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void {
    this.trans.setLocal(
      this.updateMovement(world, deltaSec, this.trans.getLocal()).newTrans
    );

    if (this.lifeTimeSec !== undefined) this.lifeTimeSec -= deltaSec;

    this.event.emit("updated", world, deltaSec);
  }

  /**
   * Set life time.
   * When life time was over, this should remove self from world.
   *
   * @param lifeTimeSec Life time in seconds.
   * @returns this.
   */
  setLifeTime(lifeTimeSec: number): this {
    this.lifeTimeSec = lifeTimeSec;
    return this;
  }

  // about collision

  /**
   * Add collision shape.
   *
   * @param shape Adding collision shape.
   * @returns this.
   */
  addCollisionShape(shape: CollisionShape): this {
    this.collision.addShape(shape);
    return this;
  }

  /**
   * Remove collision shape.
   *
   * @param shape Removing collision shape.
   * @returns this.
   */
  removeCollisionShape(shape: CollisionShape): this {
    this.collision.removeShape(shape);
    return this;
  }

  /**
   * Set self is huge number collision.
   *
   * Huge number collision will collide with only non-huge number collisions.
   *
   * @param isHuge
   * @return this.
   */
  setCollisionAsHugeNumber(isHuge: boolean): this {
    this.collision.setIsHugeNumber(isHuge);
    return this;
  }

  /**
   * Set this CollisionGroup.
   *
   * @param newGroup New group of this.
   * @returns this.
   */
  setCollisionGroup(newGroup: CollisionGroup): this {
    this.collision.setGroup(newGroup);
    return this;
  }

  /**
   * Set collision enable.
   *
   * @param newEnable Enabling.
   * @returns this.
   */
  setCollisionEnable(newEnable: boolean): this {
    this.collision.setEnable(newEnable);
    return this;
  }

  /**
   * Get this collision.
   *
   * @returns This collision.
   */
  getCollision(): Collision {
    return this.collision;
  }

  /**
   * Notify overlapped with other actor.
   *
   * @param world Our world.
   * @param others Collided Other actors.
   */
  notifyOverlappedWith(world: World, others: Set<Actor>): void {
    this.event.emit("overlapped", world, others);
  }

  // about display-object

  /**
   * Add display object.
   *
   * @param obj Adding display object.
   * @returns this.
   */
  addDisplayObject(obj: DisplayObject): this {
    this.objects.add(obj);
    this.attachTransformation(obj.trans, false);
    return this;
  }

  /**
   * Remove display object.
   *
   * @param obj Removing display object.
   * @returns this.
   */
  removeDisplayObject(obj: DisplayObject): this {
    this.objects.delete(obj);
    return this;
  }

  /**
   * Iterate containing display objects.
   *
   * @param callback
   */
  iterateDisplayObject(callback: (obj: DisplayObject) => void): void {
    this.objects.forEach((o) => callback(o));
  }

  // about health

  /**
   * Init health and healthMax.
   *
   * @param health Initial health.
   * @param health HealthMax.
   * @returns this.
   */
  initHealth(health: number, healthMax: number): this {
    this.healthComponent.init(health, healthMax);
    return this;
  }

  /**
   * Current health.
   *
   * @returns Current health.
   */
  health(): number {
    return this.healthComponent.value();
  }

  /**
   * Max health.
   *
   * @returns Max health.
   */
  healthMax(): number {
    return this.healthComponent.max();
  }

  /**
   * Return self is dead.
   *
   * @returns Self is dead.
   */
  isDead(): boolean {
    return this.healthComponent.value() === 0;
  }

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
  ): { actualDamage: number; died: boolean } {
    const r = this.healthComponent.sub(damage);
    const actualDamage = -r.variation;
    const died = r.zeroed;

    dealer.notifyDealtDamage(world, actualDamage, this, type);
    this.event.emit("takenDamage", world, actualDamage, dealer, type);
    if (died) {
      this.reserveRemovingSelfFromWorld();
      dealer.notifyKilled(world, this, type);
      this.event.emit("dead", world, dealer, type);
    }
    return { actualDamage, died };
  }

  /**
   * Kill this.
   *
   * @param world World.
   * @param dealer Damage dealer killing this directly.
   * @param type Damage type.
   */
  kill(world: World, dealer: Actor, type: DamageType): void {
    if (this.healthComponent.value() === 0) return;

    this.healthComponent.init(0, this.healthComponent.max());
    dealer.notifyKilled(world, this, type);
    this.event.emit("dead", world, dealer, type);
  }

  /**
   * Heal health.
   *
   * @param world World.
   * @param amount Healing amount.
   */
  heal(world: World, amount: number): { actualHealed: number } {
    const r = this.healthComponent.add(amount);
    this.event.emit("beHealed", world, r.variation);
    return { actualHealed: r.variation };
  }

  // about damage dealer

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
  ): void {
    this.event.emit("dealDamage", world, damage, taker, type);
  }

  /**
   * Notify this kill other.
   *
   * @param world Our world.
   * @param taker Damaged Actor.
   * @param type Damage type.
   */
  notifyKilled(world: World, taker: Actor, type: DamageType): void {
    this.event.emit("killed", world, taker, type);
  }

  // about team

  /**
   * Set team joined this.
   *
   * @param team New team.
   * @returns this.
   */
  setTeam(team: Team): this {
    this.team = team;
    return this;
  }

  /**
   * Get team joined this.
   *
   * @returns Team.
   */
  getTeam(): Team {
    return this.team;
  }

  /**
   * Set ActorRole.
   *
   * @param role ActorRole of self.
   * @returns this.
   */
  setRole(role: ActorRole): this {
    this.role = role;
    return this;
  }

  /**
   * Get ActorRole of self.
   *
   * @returns ActorRole of self.
   */
  getRole(): ActorRole {
    return this.role;
  }

  /**
   * Add sub actor to this.
   * Sub actor would be attached to this.
   *
   * @param addingSubActor Adding actors.
   * @returns this.
   */
  addSubActor(...addingSubActor: Actor[]): this {
    const someSubActorsWasAlreadySubActor = addingSubActor.some(
      (sub) => sub.getOwnerActor() !== undefined
    );
    if (someSubActorsWasAlreadySubActor)
      throw new Error("Actor was already sub actor");

    addingSubActor.forEach((sub) => {
      this.subActors.add(sub);
      this.attachActor(sub, false);
      sub.ownerActor = this;
    });

    return this;
  }

  /**
   * Remove sub actor from this.
   * Sub actor would be detach from parent.
   *
   * @param removingSubActor Removing actors.
   * @returns this.
   */
  removeSubActor(...removingSubActor: Actor[]): this {
    const someActorIsNotOwnedByThis = removingSubActor.some(
      (sub) => sub.getOwnerActor() !== this
    );
    if (someActorIsNotOwnedByThis)
      throw new Error("Actor is not this sub actor");

    removingSubActor.forEach((sub) => {
      this.subActors.delete(sub);
      this.detachActor(sub, true);
      sub.ownerActor = undefined;
    });

    return this;
  }

  /**
   * Check this has given actor as sub actor.
   *
   * @param subActor
   * @returns this.
   */
  hasSubActor(subActor: Actor): boolean {
    return this.subActors.has(subActor);
  }

  /**
   * Get parent actor if this is sub-actor.
   * If this is not sub-actor, return undefined.
   *
   * @returns Owner actor or undefined.
   */
  getOwnerActor(): Actor | undefined {
    return this.ownerActor;
  }

  /**
   * Get sub-actors.
   */
  getSubActors(): Actor[] {
    return Array.from(this.subActors);
  }
}
