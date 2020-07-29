import { Matrix, Vector } from "trans-vector2d";
import { Actor } from "@curtain-call/actor";
import { World } from "@curtain-call/world";
import { RelativeMover } from "@curtain-call/mover";
import { RectCollisionShape } from "@curtain-call/collision";
import { PositionStatusWithArea } from "@curtain-call/util";

/**
 * SimpleBullet move with constant velocity to front.
 * Deal damage when hit to `Character` and remove self from world.
 */
export class SimpleBullet<TWorld extends World = World> extends Actor<TWorld> {
  private damage = 0;
  private damageName = "";
  private lifeTimeSec = 0;
  private visualRadius = 0;
  private readonly mover: RelativeMover<TWorld>;
  private readonly collisionShape: RectCollisionShape;

  constructor(diArgs?: {
    readonly mover?: RelativeMover<TWorld>;
    readonly collisionShape?: RectCollisionShape;
  }) {
    super();
    this.mover = diArgs?.mover || new RelativeMover<TWorld>();
    this.collisionShape = diArgs?.collisionShape || new RectCollisionShape();

    this.addMover(this.mover).addCollisionShape(this.collisionShape);
  }

  setVisualRadius(radius: number): this {
    this.visualRadius = radius;
    return this;
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
    const { translation } = this.getWorldTransform().decompose();
    const isNotVisible =
      world.camera.calcVisibilityStatus(translation, this.visualRadius) ===
      PositionStatusWithArea.outOfArea;
    return (
      isNotVisible ||
      this.lifeTimeSec <= 0 ||
      super.shouldRemoveSelfFromWorld(world)
    );
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
    this.mover.setDelta(Matrix.from({ translation: { x: args.speed, y: 0 } }));
    this.damage = args.damage;
    this.damageName = args.damageName;
    this.lifeTimeSec = args.lifeTimeSec;
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
    this.removeSelfFromWorld(false);
  }

  private processHit(world: TWorld, other: Actor<TWorld>): boolean {
    if (this.shouldRemoveSelfFromWorld(world)) return false;
    other.takeDamage(world, this.damage, this, {
      name: this.damageName,
    });
    this.removeSelfFromWorld(true);
    return true;
  }
}
