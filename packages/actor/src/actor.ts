import { EventEmitter } from "eventemitter3";
import { Updatable, Transformation, Team } from "@curtain-call/util";
import { DamageDealer, Health, DamageType } from "@curtain-call/health";
import { Mover } from "@curtain-call/mover";
import { DisplayObject } from "@curtain-call/display-object";
import {
  CollisionGroup,
  CollisionShape,
  Collision,
} from "@curtain-call/collision";
import { Matrix, VectorLike } from "trans-vector2d";

/**
 * Actor is main object used in World.
 */
export class Actor<TWorld>
  implements Updatable<TWorld>, DamageDealer<TWorld, Actor<TWorld>> {
  private shouldRemoveSelf = false;

  /** Event. */
  public readonly event = new EventEmitter<{
    // world
    addedToWorld: [TWorld];
    removedFromWorld: [TWorld];
    updated: [TWorld, number];
    // collision
    overlapped: [TWorld, Set<Actor<TWorld>>];
    // health
    takenDamage: [
      TWorld,
      number,
      DamageDealer<TWorld, Actor<TWorld>>,
      DamageType
    ];
    dead: [TWorld, DamageDealer<TWorld, Actor<TWorld>>, DamageType];
    beHealed: [TWorld, number];
    // damage dealer
    dealDamage: [TWorld, number, Actor<TWorld>, DamageType];
    killed: [TWorld, Actor<TWorld>, DamageType];
  }>();

  private readonly trans: Transformation;
  private readonly healthComponent: Health;
  private readonly collision: Collision;
  private readonly objects = new Set<DisplayObject>();
  private readonly movers = new Set<Mover<TWorld>>();
  private parent?: DamageDealer<TWorld, Actor<TWorld>>;
  private team = Team.noSide;
  private ownerActor?: Actor<TWorld>;
  private subActors = new Set<Actor<TWorld>>();

  constructor(diArgs?: {
    trans?: Transformation;
    health?: Health;
    collision?: Collision;
  }) {
    this.trans = diArgs?.trans || new Transformation();
    this.healthComponent = diArgs?.health || new Health();
    this.collision = (diArgs?.collision || new Collision()).attachTo(
      this.trans
    );
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
   * @param newTrans New local transform.
   * @returns this.
   */
  setLocalTransform(newTrans: Matrix): this {
    this.trans.setLocal(newTrans);
    return this;
  }

  /**
   * Attach self Transformation to other actor.
   *
   * @param parent Parent Actor.
   * @returns this.
   */
  attachTo(parent: Actor<TWorld>): this {
    this.trans.attachTo(parent.trans);
    return this;
  }

  /**
   * Attach self Transformation to other transform.
   *
   * @param parent Parent Transformation.
   * @returns this.
   */
  attachToTransformation(parent: Transformation): this {
    this.trans.attachTo(parent);
    return this;
  }

  /**
   * Detach self Transformation from parent.
   *
   * @return this.
   */
  detachFromParent(): this {
    this.trans.detachFromParent();
    return this;
  }

  /**
   * Get world transform.
   *
   * @return This transform on global space.
   */
  getWorldTransform(): Matrix {
    return this.trans.getGlobal();
  }

  /**
   * Attach other transformation to this transformation.
   *
   * @param trans Attaching trans.
   * @returns this.
   */
  attachTransformation(trans: Transformation): this {
    trans.attachTo(this.trans);
    return this;
  }

  /**
   * Add mover.
   *
   * @param mover Adding mover.
   * @returns this.
   */
  addMover(mover: Mover<TWorld>): this {
    this.movers.add(mover);
    return this;
  }

  /**
   * Remove mover.
   *
   * @param mover Removing mover.
   * @returns this.
   */
  removeMover(mover: Mover<TWorld>): this {
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
    world: TWorld,
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
   * Remove self from world at next update.
   *
   * @param removeSelf Remove self if true.
   * @returns Self must remove from world.
   */
  removeSelfFromWorld(removeSelf: boolean): this {
    this.shouldRemoveSelf = removeSelf;
    return this;
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @param _world World.
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(_world: TWorld): boolean {
    return this.shouldRemoveSelf;
  }

  /**
   * Notify added to world.
   * Called from only World.
   *
   * @param world Added World.
   */
  notifyAddedToWorld(world: TWorld): void {
    this.event.emit("addedToWorld", world);
  }

  /**
   * Notify removed from world.
   * Called from only World.
   *
   * @param world Removed World.
   */
  notifyRemovedFromWorld(world: TWorld): void {
    this.event.emit("removedFromWorld", world);
  }

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: TWorld, deltaSec: number): void {
    this.trans.setLocal(
      this.updateMovement(world, deltaSec, this.trans.getLocal()).newTrans
    );
    this.updateDisplayObject(deltaSec);

    this.event.emit("updated", world, deltaSec);
  }

  // about collision

  /**
   * Add collision shape.
   *
   * @param shape Adding collision shape.
   * @returns this.
   */
  addCollisionShape(shape: CollisionShape): this {
    this.collision.add(shape);
    return this;
  }

  /**
   * Remove collision shape.
   *
   * @param shape Removing collision shape.
   * @returns this.
   */
  removeCollisionShape(shape: CollisionShape): this {
    this.collision.remove(shape);
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
  notifyOverlappedWith(world: TWorld, others: Set<Actor<TWorld>>): void {
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
    obj.trans.attachTo(this.trans);
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

  protected updateDisplayObject(deltaSec: number): void {
    this.objects.forEach((o) => o.updatePixiObject(deltaSec));
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
    return this.healthComponent.current();
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
    return this.healthComponent.isDead();
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
    world: TWorld,
    damage: number,
    dealer: DamageDealer<TWorld, Actor<TWorld>>,
    type: DamageType
  ): { actualDamage: number; died: boolean } {
    const r = this.healthComponent.takeDamage(damage);
    dealer.notifyDealtDamage(world, r.actualDamage, this, type);
    this.event.emit("takenDamage", world, r.actualDamage, dealer, type);
    if (r.died) {
      dealer.notifyKilled(world, this, type);
      this.event.emit("dead", world, dealer, type);
    }
    return r;
  }

  /**
   * Kill this.
   *
   * @param world World.
   * @param dealer Damage dealer killing this directly.
   * @param type Damage type.
   */
  kill(
    world: TWorld,
    dealer: DamageDealer<TWorld, Actor<TWorld>>,
    type: DamageType
  ): void {
    const r = this.healthComponent.kill();
    dealer.notifyKilled(world, this, type);
    this.event.emit("dead", world, dealer, type);
    return r;
  }

  /**
   * Heal health.
   *
   * @param world World.
   * @param amount Healing amount.
   */
  heal(world: TWorld, amount: number): { actualHealed: number } {
    const r = this.healthComponent.heal(amount);
    this.event.emit("beHealed", world, amount);
    return r;
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
    world: TWorld,
    damage: number,
    taker: Actor<TWorld>,
    type: DamageType
  ): void {
    this.event.emit("dealDamage", world, damage, taker, type);
    if (!this.parent) return;
    this.parent.notifyDealtDamage(world, damage, taker, type);
  }

  /**
   * Notify this kill other.
   *
   * @param world Our world.
   * @param taker Damaged Actor.
   * @param type Damage type.
   */
  notifyKilled(world: TWorld, taker: Actor<TWorld>, type: DamageType): void {
    this.event.emit("killed", world, taker, type);
    if (!this.parent) return;
    this.parent.notifyKilled(world, taker, type);
  }

  /**
   * Set damaging chain parent.
   * When this dealt damage, this tell damaging and killing to parent `DamageDealer`.
   *
   * @param parentDealer Parent.
   * @returns this.
   */
  setDamageDealerParent(
    parentDealer: DamageDealer<TWorld, Actor<TWorld>>
  ): this {
    this.parent = parentDealer;
    return this;
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
   * Add sub actor to this.
   * Sub actor would be attached to this.
   *
   * @param addingSubActor Adding actors.
   * @returns this.
   */
  addSubActor(...addingSubActor: Actor<TWorld>[]): this {
    const someSubActorsWasAlreadySubActor = addingSubActor.some(
      (sub) => sub.getOwnerActor() !== undefined
    );
    if (someSubActorsWasAlreadySubActor)
      throw new Error("Actor was already sub actor");

    addingSubActor.forEach((sub) => {
      this.subActors.add(sub);
      sub.attachTo(this);
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
  removeSubActor(...removingSubActor: Actor<TWorld>[]): this {
    const someActorIsNotOwnedByThis = removingSubActor.some(
      (sub) => sub.getOwnerActor() !== this
    );
    if (someActorIsNotOwnedByThis)
      throw new Error("Actor is not this sub actor");

    removingSubActor.forEach((sub) => {
      this.subActors.delete(sub);
      sub.detachFromParent();
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
  hasSubActor(subActor: Actor<TWorld>): boolean {
    return this.subActors.has(subActor);
  }

  /**
   * Get parent actor if this is sub-actor.
   * If this is not sub-actor, return undefined.
   *
   * @returns Owner actor or undefined.
   */
  getOwnerActor(): Actor<TWorld> | undefined {
    return this.ownerActor;
  }

  /**
   * Get sub-actors.
   */
  getSubActors(): Actor<TWorld>[] {
    return Array.from(this.subActors);
  }
}
