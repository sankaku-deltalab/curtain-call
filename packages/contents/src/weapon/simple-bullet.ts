import { Matrix, Vector } from "trans-vector2d";
import { Actor } from "@curtain-call/actor";
import { World } from "@curtain-call/world";
import { RelativeMover } from "@curtain-call/mover";
import { RectCollisionShape } from "@curtain-call/collision";

/**
 * SimpleBullet move with constant velocity to front.
 * Deal damage when hit to `Character` and remove self from world.
 */
export class SimpleBullet<TWorld extends World = World> extends Actor<TWorld> {
  private damage = 0;
  private damageName = "";
  private lifeTimeSec = 0;
  private readonly mover: RelativeMover<TWorld>;
  private readonly collisionShape: RectCollisionShape;

  constructor(diArgs?: {
    readonly mover?: RelativeMover<TWorld>;
    readonly collisionShape?: RectCollisionShape;
  }) {
    super();
    this.mover = diArgs?.mover || new RelativeMover<TWorld>();
    this.collisionShape = diArgs?.collisionShape || new RectCollisionShape();

    this.movers.add(this.mover);

    this.collision.add(this.collisionShape);
    this.collision.event.on("overlapped", (world, others) => {
      others.forEach((other) => {
        if (this.shouldRemoveSelfFromWorld(world)) return;
        const otherActor = other.owner();
        this.processHit(world, otherActor);
      });
    });
  }

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: TWorld, deltaSec: number): void {
    super.update(world, deltaSec);
    this.lifeTimeSec -= deltaSec;
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @param world World.
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(world: TWorld): boolean {
    return this.lifeTimeSec <= 0 || super.shouldRemoveSelfFromWorld(world);
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
    this.trans.setLocal(args.trans);
    this.mover.setDelta(Matrix.from({ translation: { x: args.speed, y: 0 } }));
    this.damage = args.damage;
    this.damageName = args.damageName;
    this.lifeTimeSec = args.lifeTimeSec;
    this.collisionShape.setSize(Vector.one.mlt(args.size));

    return this;
  }

  private processHit(world: TWorld, other: Actor<TWorld>): boolean {
    if (this.shouldRemoveSelfFromWorld(world)) return false;
    other.health.takeDamage(world, this.damage, this.damageDealer, {
      name: this.damageName,
    });
    this.removeSelfFromWorld();
    return true;
  }
}
