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
  Timer,
  Transformation,
} from "./interface";
import {
  Actor as IActor,
  DamageType,
  ActorRole,
  Team,
  ActorEvent,
} from "./actor-interface";
import {
  ActorWithCollision,
  ActorWithController,
  ActorWithDamaging,
  ActorWithDisplayObject,
  ActorWithInfo,
  ActorWithSubActors,
  ActorWithTimer,
  ActorWithTransformation,
  ActorWithWorld,
} from "./actor-subsystem";

export { diContainer };

/**
 * Actor is individual in world.
 */
@autoInjectable()
export class Actor implements IActor {
  /** Event. */
  public readonly event: ActorEvent;

  private readonly actorCollision: ActorWithCollision;
  private readonly actorController: ActorWithController;
  private readonly actorDamaging: ActorWithDamaging;
  private readonly actorDisplay: ActorWithDisplayObject;
  private readonly actorInfo: ActorWithInfo;
  private readonly actorSubActors: ActorWithSubActors;
  private readonly actorTimer: ActorWithTimer;
  private readonly actorTransform: ActorWithTransformation;
  private readonly actorWithWorld: ActorWithWorld;

  constructor(
    @inject("EventEmitter") event?: ActorEvent,
    @inject("Transformation") trans?: Transformation,
    @inject("FiniteResource") health?: FiniteResource,
    @inject("Collision") collision?: Collision
  ) {
    if (!(event && trans && health && collision))
      throw new Error("DI object is not exist");
    this.event = event;
    this.actorCollision = new ActorWithCollision(event, collision, trans);
    this.actorController = new ActorWithController();
    this.actorDamaging = new ActorWithDamaging(event, health);
    this.actorDisplay = new ActorWithDisplayObject(trans);
    this.actorInfo = new ActorWithInfo();
    this.actorSubActors = new ActorWithSubActors(trans);
    this.actorTimer = new ActorWithTimer();
    this.actorTransform = new ActorWithTransformation(trans);
    this.actorWithWorld = new ActorWithWorld(event);
  }

  /**
   * Get controller.
   * If self is not controlled by ActorController, return undefined.
   *
   * @returns Controller.
   */
  getController(): ActorController | undefined {
    return this.actorController.getController();
  }

  /**
   * Set controller.
   *
   * @param controller Controller.
   * @returns this.
   */
  setController(controller: ActorController): this {
    this.actorController.setController(controller);
    return this;
  }

  // about timer

  /**
   * Add timer.
   *
   * @param timer
   * @returns this.
   */
  addTimer(timer: Timer): this {
    this.actorTimer.addTimer(timer);
    return this;
  }

  /**
   * Remove timer.
   *
   * @param timer
   * @returns this.
   */
  removeTimer(timer: Timer): this {
    this.actorTimer.removeTimer(timer);
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
    this.actorTransform.moveTo(pos);
    return this;
  }

  /**
   * Rotate to specified angle.
   *
   * @param angle New angle. Not delta.
   * @returns this.
   */
  rotateTo(angle: number): this {
    this.actorTransform.rotateTo(angle);
    return this;
  }

  /**
   * Set local transform.
   *
   * @param newLocalTrans New local transform.
   * @returns this.
   */
  setLocalTransform(newLocalTrans: Matrix): this {
    this.actorTransform.setLocalTransform(newLocalTrans);
    return this;
  }

  /**
   * Swap local transform.
   *
   * @param swapper Function given current transform and return new transform.
   * @returns this.
   */
  swapLocalTransform(swapper: (current: Matrix) => Matrix): this {
    this.actorTransform.swapLocalTransform(swapper);
    return this;
  }

  /**
   * Get Transformation of self.
   *
   * @returns Transformation of self.
   */
  getTransformation(): Transformation {
    return this.actorTransform.getTransformation();
  }

  /**
   * Attach other actor to self.
   *
   * @param child Attaching child Actor.
   * @param keepWorldTransform When attached, keep world transform of child.
   * @returns this.
   */
  attachActor(child: IActor, keepWorldTransform: boolean): this {
    this.actorTransform.attachActor(child, keepWorldTransform);
    return this;
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
    this.actorTransform.attachTransformation(child, keepWorldTransform);
    return this;
  }

  /**
   * Detach child Actor from self.
   *
   * @param child Detaching child Actor.
   * @param keepWorldTransform When detached, keep world transform of child.
   * @return this.
   */
  detachActor(child: IActor, keepWorldTransform: boolean): this {
    this.actorTransform.detachActor(child, keepWorldTransform);
    return this;
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
    this.actorTransform.detachTransformation(child, keepWorldTransform);
    return this;
  }

  /**
   * Add mover.
   *
   * @param mover Adding mover.
   * @returns this.
   */
  addMover(mover: Mover): this {
    this.actorTransform.addMover(mover);
    return this;
  }

  /**
   * Remove mover.
   *
   * @param mover Removing mover.
   * @returns this.
   */
  removeMover(mover: Mover): this {
    this.actorTransform.removeMover(mover);
    return this;
  }

  // about world

  /**
   * Remove self from world at next world update.
   *
   * @returns this.
   */
  reserveRemovingSelfFromWorld(): this {
    this.actorWithWorld.reserveRemovingSelfFromWorld();
    return this;
  }

  /**
   * Cancel removing self from world at next world update.
   *
   * @returns this.
   */
  cancelRemovingSelfFromWorld(): this {
    this.actorWithWorld.cancelRemovingSelfFromWorld();
    return this;
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @param world World.
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(world: World): boolean {
    return (
      this.actorController.shouldRemoveSelfFromWorld(world) ||
      this.actorWithWorld.shouldRemoveSelfFromWorld(world) ||
      this.actorDamaging.shouldRemoveSelfFromWorld()
    );
  }

  /**
   * Notify added to world.
   * Called from only World.
   *
   * @param world Added World.
   */
  notifyAddedToWorld(world: World): void {
    this.actorWithWorld.notifyAddedToWorld(world);
  }

  /**
   * Notify removed from world.
   * Called from only World.
   *
   * @param world Removed World.
   */
  notifyRemovedFromWorld(world: World): void {
    this.actorWithWorld.notifyRemovedFromWorld(world);
  }

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void {
    this.actorTimer.update(world, deltaSec);
    this.actorController.update(world, deltaSec);
    this.actorTransform.update(world, deltaSec);
    this.actorWithWorld.update(world, deltaSec);
    this.actorDisplay.update(world, deltaSec);

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
    this.actorWithWorld.setLifeTime(lifeTimeSec);
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
    this.actorCollision.addCollisionShape(shape);
    return this;
  }

  /**
   * Remove collision shape.
   *
   * @param shape Removing collision shape.
   * @returns this.
   */
  removeCollisionShape(shape: CollisionShape): this {
    this.actorCollision.removeCollisionShape(shape);
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
    this.actorCollision.setCollisionAsHugeNumber(isHuge);
    return this;
  }

  /**
   * Set this CollisionGroup.
   *
   * @param newGroup New group of this.
   * @returns this.
   */
  setCollisionGroup(newGroup: CollisionGroup): this {
    this.actorCollision.setCollisionGroup(newGroup);
    return this;
  }

  /**
   * Set collision enable.
   *
   * @param newEnable Enabling.
   * @returns this.
   */
  setCollisionEnable(newEnable: boolean): this {
    this.actorCollision.setCollisionEnable(newEnable);
    return this;
  }

  /**
   * Get this collision.
   *
   * @returns This collision.
   */
  getCollision(): Collision {
    return this.actorCollision.getCollision();
  }

  /**
   * Notify overlapped with other actor.
   *
   * @param world Our world.
   * @param others Collided Other actors.
   */
  notifyOverlappedWith(world: World, others: Set<IActor>): void {
    this.actorCollision.notifyOverlappedWith(world, others);
  }

  // about display-object

  /**
   * Add display object.
   *
   * @param obj Adding display object.
   * @returns this.
   */
  addDisplayObject(obj: DisplayObject): this {
    this.actorDisplay.addDisplayObject(obj);
    return this;
  }

  /**
   * Remove display object.
   *
   * @param obj Removing display object.
   * @returns this.
   */
  removeDisplayObject(obj: DisplayObject): this {
    this.actorDisplay.removeDisplayObject(obj);
    return this;
  }

  /**
   * Iterate containing display objects.
   *
   * @param callback
   */
  iterateDisplayObject(callback: (obj: DisplayObject) => void): void {
    this.actorDisplay.iterateDisplayObject(callback);
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
    this.actorDamaging.initHealth(health, healthMax);
    return this;
  }

  /**
   * Current health.
   *
   * @returns Current health.
   */
  health(): number {
    return this.actorDamaging.health();
  }

  /**
   * Max health.
   *
   * @returns Max health.
   */
  healthMax(): number {
    return this.actorDamaging.healthMax();
  }

  /**
   * Return self is dead.
   *
   * @returns Self is dead.
   */
  isDead(): boolean {
    return this.actorDamaging.isDead();
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
    dealer: IActor,
    type: DamageType
  ): { actualDamage: number; died: boolean } {
    return this.actorDamaging.takeDamage(world, damage, dealer, type);
  }

  /**
   * Kill self.
   *
   * @param world World.
   * @param dealer Death dealer.
   * @param type Damage type.
   */
  killSelf(world: World, dealer: IActor, type: DamageType): { died: boolean } {
    return this.actorDamaging.killSelf(world, dealer, type);
  }

  /**
   * Heal health.
   *
   * @param world World.
   * @param amount Healing amount.
   */
  heal(world: World, amount: number): { actualHealed: number } {
    return this.actorDamaging.heal(world, amount);
  }

  // about damage dealer

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
    taker: IActor,
    type: DamageType
  ): { actualDamage: number; killed: boolean } {
    return this.actorDamaging.dealDamage(world, damage, this, taker, type);
  }

  /**
   * Kill other actor.
   *
   * @param world Our world.
   * @param taker Damaged actor.
   * @param type Damage type.
   */
  killOther(
    world: World,
    taker: IActor,
    type: DamageType
  ): { killed: boolean } {
    return this.actorDamaging.killOther(world, this, taker, type);
  }

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
    taker: IActor,
    type: DamageType
  ): void {
    this.actorDamaging.notifyDealtDamage(world, damage, taker, type);
  }

  /**
   * Notify this kill other.
   *
   * @param world Our world.
   * @param taker Damaged Actor.
   * @param type Damage type.
   */
  notifyKilled(world: World, taker: IActor, type: DamageType): void {
    this.actorDamaging.notifyKilled(world, taker, type);
  }

  // about team

  /**
   * Set team joined this.
   *
   * @param team New team.
   * @returns this.
   */
  setTeam(team: Team): this {
    this.actorInfo.setTeam(team);
    return this;
  }

  /**
   * Get team joined this.
   *
   * @returns Team.
   */
  getTeam(): Team {
    return this.actorInfo.getTeam();
  }

  /**
   * Set ActorRole.
   *
   * @param role ActorRole of self.
   * @returns this.
   */
  setRole(role: ActorRole): this {
    this.actorInfo.setRole(role);
    return this;
  }

  /**
   * Get ActorRole of self.
   *
   * @returns ActorRole of self.
   */
  getRole(): ActorRole {
    return this.actorInfo.getRole();
  }

  /**
   * Add sub actor to this.
   * Sub actor would be attached to this.
   *
   * @param addingSubActor Adding actors.
   * @returns this.
   */
  addSubActor(...addingSubActor: IActor[]): this {
    this.actorSubActors.addSubActor(...addingSubActor);
    return this;
  }

  /**
   * Remove sub actor from this.
   * Sub actor would be detach from parent.
   *
   * @param removingSubActor Removing actors.
   * @returns this.
   */
  removeSubActor(...removingSubActor: IActor[]): this {
    this.actorSubActors.removeSubActor(...removingSubActor);
    return this;
  }

  /**
   * Get sub-actors.
   */
  getSubActors(): IActor[] {
    return this.actorSubActors.getSubActors();
  }
}
