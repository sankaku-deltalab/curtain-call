import { inject, autoInjectable } from "tsyringe";
import { Matrix, Vector, VectorLike } from "trans-vector2d";
import {
  IActor,
  World,
  PositionInAreaStatus,
  Mover,
  ActorRole,
  CollisionShape,
  ActorExtension,
} from "@curtain-call/actor";

export interface LocalConstantMover extends Mover {
  setVelocity(velocity: Matrix): this;
}

export interface RectCollisionShape extends CollisionShape {
  setSize(size: VectorLike): this;
}

/**
 * SimpleBullet move to front with constant velocity.
 */
@autoInjectable()
export class SimpleBullet implements ActorExtension {
  private damage = 0;
  private damageName = "";
  private visualRadius = 0;
  private alreadyHit = false;
  private owner?: IActor;
  private readonly mover: LocalConstantMover;
  private readonly collisionShape: RectCollisionShape;

  constructor(
    @inject("LocalConstantMover") mover?: LocalConstantMover,
    @inject("RectCollisionShape") collisionShape?: RectCollisionShape
  ) {
    if (!(mover && collisionShape)) throw new Error("DI failed");

    this.mover = mover;
    this.collisionShape = collisionShape;
  }

  /**
   * Notify added to actor.
   *
   * @param actor Actor using this.
   */
  notifyAddedToActor(actor: IActor): void {
    this.owner = actor;
    actor
      .setRole(ActorRole.bullet)
      .addMover(this.mover)
      .addCollisionShape(this.collisionShape);
  }

  /**
   * Update self.
   */
  update(): void {
    // do nothing
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @param world World.
   * @param actor Actor using this.
   * @returns Self must remove from world.
   */
  shouldBeRemovedFromWorld(world: World, actor: IActor): boolean {
    const { translation } = actor.getTransformation().getGlobal().decompose();
    const isNotVisible =
      world.getCamera().calcVisibilityStatus(translation, this.visualRadius) ===
      PositionInAreaStatus.outOfArea;
    return isNotVisible || this.alreadyHit;
  }

  setVisualRadius(radius: number): this {
    this.visualRadius = radius;
    return this;
  }

  /**
   * Init this.
   *
   * @param args.trans Initial transformation.
   * @param args.speed Speed.
   * @param args.lifeTimeSec Life time. When life time was ended, remove self from world.
   */
  init(args: {
    trans: Matrix;
    speed: number;
    lifeTimeSec: number;
    damage: number;
    damageName: string;
    size: number;
  }): this {
    const owner = this.getOwner();
    owner.setLocalTransform(args.trans);
    this.mover.setVelocity(
      Matrix.from({ translation: { x: args.speed, y: 0 } })
    );
    this.damage = args.damage;
    this.damageName = args.damageName;
    owner.setLifeTime(args.lifeTimeSec);
    this.collisionShape.setSize(Vector.one.mlt(args.size));

    owner.event.on("overlapped", (world, others) => {
      others.forEach((other) => {
        if (owner.shouldBeRemovedFromWorld(world)) return;
        this.processHit(world, other);
      });
    });

    return this;
  }

  clearSelfForReuse(): void {
    this.alreadyHit = false;
    const owner = this.getOwner();
    owner.event.removeAllListeners();
    owner.cancelRemovingSelfFromWorld();
  }

  private processHit(world: World, other: IActor): boolean {
    const owner = this.getOwner();
    if (owner.shouldBeRemovedFromWorld(world)) return false;
    other.takeDamage(world, this.damage, owner, {
      name: this.damageName,
    });
    this.alreadyHit = true;
    return true;
  }

  private getOwner(): IActor {
    if (!this.owner) throw new Error("Bullet is not added to actor");
    return this.owner;
  }
}
