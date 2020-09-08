import { inject, autoInjectable } from "tsyringe";
import { Matrix, Vector, VectorLike } from "trans-vector2d";
import {
  Actor,
  ActorEvent,
  Transformation,
  FiniteResource,
  World,
  PositionInAreaStatus,
  Mover,
  Collision,
  ActorRole,
  CollisionShape,
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
export class SimpleBullet extends Actor {
  private damage = 0;
  private damageName = "";
  private visualRadius = 0;
  private readonly mover: LocalConstantMover;
  private readonly collisionShape: RectCollisionShape;

  constructor(
    @inject("EventEmitter") event?: ActorEvent,
    @inject("Transformation") trans?: Transformation,
    @inject("FiniteResource") health?: FiniteResource,
    @inject("Collision") collision?: Collision,
    @inject("LocalConstantMover") mover?: LocalConstantMover,
    @inject("RectCollisionShape") collisionShape?: RectCollisionShape
  ) {
    super(event, trans, health, collision);
    if (!(event && trans && health && collision && mover && collisionShape))
      throw new Error("DI failed");

    this.mover = mover;
    this.collisionShape = collisionShape;
    this.setRole(ActorRole.bullet)
      .addMover(this.mover)
      .addCollisionShape(this.collisionShape);
  }

  setVisualRadius(radius: number): this {
    this.visualRadius = radius;
    return this;
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @param world World.
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(world: World): boolean {
    const { translation } = this.getTransformation().getGlobal().decompose();
    const isNotVisible =
      world.getCamera().calcVisibilityStatus(translation, this.visualRadius) ===
      PositionInAreaStatus.outOfArea;
    return isNotVisible || super.shouldRemoveSelfFromWorld(world);
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
    this.setLocalTransform(args.trans);
    this.mover.setVelocity(
      Matrix.from({ translation: { x: args.speed, y: 0 } })
    );
    this.damage = args.damage;
    this.damageName = args.damageName;
    this.setLifeTime(args.lifeTimeSec);
    this.collisionShape.setSize(Vector.one.mlt(args.size));

    this.event.on("overlapped", (world, others) => {
      others.forEach((other) => {
        if (this.shouldRemoveSelfFromWorld(world)) return;
        this.processHit(world, other);
      });
    });

    return this;
  }

  clearSelfForReuse(): void {
    this.event.removeAllListeners();
    this.cancelRemovingSelfFromWorld();
  }

  private processHit(world: World, other: Actor): boolean {
    if (this.shouldRemoveSelfFromWorld(world)) return false;
    other.takeDamage(world, this.damage, this, {
      name: this.damageName,
    });
    this.reserveRemovingSelfFromWorld();
    return true;
  }
}
