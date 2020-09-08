import * as gt from "guntree";
import { Transformation, World } from "@curtain-call/actor";
import { Matrix } from "trans-vector2d";
import { BulletGenerator } from "../bullet-generator";
import { TargetProvider } from "../target-provider";
import { NullTargetProvider } from "../target-provider/null-target-provider";
import { Weapon } from "./weapon";

class GuntreeOwner implements gt.Owner {
  constructor(
    private readonly world: World,
    private readonly muzzles: Map<string, Transformation>,
    private readonly targetProvider: TargetProvider
  ) {}

  getMuzzleTransform(name: string): Matrix {
    if (!this.world || !this.muzzles) throw new Error();
    const muzzle = this.muzzles.get(name);
    if (!muzzle) throw new Error(`Muzzle ${name} is not set`);
    return muzzle.getGlobal();
  }

  getEnemyTransform(name: string): Matrix {
    if (!this.world || !this.targetProvider) throw new Error();
    const targetTrans = this.targetProvider
      .getTarget(this.world)
      ?.getTransformation()
      .getGlobal();
    if (targetTrans) return targetTrans;

    return this.getMuzzleTransform(name).globalize(
      Matrix.translation({ x: 1, y: 0 })
    );
  }
}

/**
 * Fire bullets with Guntree.
 */
export class GuntreeWeapon extends Weapon {
  private readonly player = new gt.Player();
  private world?: World;
  private guntree: gt.Gun = gt.nop();
  private muzzles = new Map<string, Transformation>();
  private bulletGenerator?: BulletGenerator;
  private targetProvider: TargetProvider = new NullTargetProvider();

  constructor() {
    super();
    this.player.events.on("fired", (data) => this.fireBullet(data));
  }

  /**
   * Init weapon.
   *
   * @param args Arguments for firing.
   * @param args.guntree Using Guntree gun.
   * @param args.muzzles Muzzle transformations.
   * @param args.bulletGenerator Generator used when fired.
   * @param args.targetProvider Target provider.
   */
  init(args: {
    guntree: gt.Gun;
    muzzles: Map<string, Transformation>;
    bulletGenerator: BulletGenerator;
    targetProvider: TargetProvider;
  }): this {
    this.guntree = args.guntree;
    this.muzzles = args.muzzles;
    this.bulletGenerator = args.bulletGenerator;
    this.targetProvider = args.targetProvider;

    return this;
  }

  /**
   * Start firing.
   *
   * @param world World.
   */
  startFire(world: World): void {
    if (this.player.isRunning()) return;

    this.world = world;

    const owner = new GuntreeOwner(world, this.muzzles, this.targetProvider);
    this.player.start(true, owner, this.guntree);
  }

  /**
   * Is firing now.
   *
   * @returns Is firing.
   */
  isFiring(): boolean {
    return this.player.isRunning();
  }

  /**
   * Request stop firing.
   */
  stopFire(): void {
    this.player.requestStop();
  }

  /**
   * Stop firing process immediately.
   */
  forceStopFire(): void {
    this.player.forceStop();
  }

  /**
   * Update firing process.
   *
   * @param _world World.
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void {
    this.world = world;
    this.player.update(deltaSec);
  }

  protected fireBullet(data: gt.FireData): void {
    if (!this.world || !this.bulletGenerator) throw new Error();
    this.bulletGenerator.generate(
      this.world,
      this,
      Matrix.from(data.transform),
      data.elapsedSec,
      data.parameters,
      data.texts
    );
  }
}
