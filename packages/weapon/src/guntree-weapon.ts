import EventEmitter from "eventemitter3";
import * as gt from "guntree";
import { Transformation } from "@curtain-call/util";
import { DamageDealer } from "@curtain-call/health";
import { Matrix } from "trans-vector2d";
import { BulletGenerator } from "./bullet-generator";
import { TargetDealer } from "./target-dealer";

class GuntreeOwner<T> implements gt.Owner {
  constructor(
    private readonly scene: T,
    private readonly muzzles: Map<string, Transformation>,
    private readonly targetDealer: TargetDealer<T>
  ) {}

  getMuzzleTransform(name: string): Matrix {
    if (!this.scene || !this.muzzles) throw new Error();
    const muzzle = this.muzzles.get(name);
    if (!muzzle) throw new Error(`Muzzle ${name} is not set`);
    return muzzle.getGlobal();
  }

  getEnemyTransform(name: string): Matrix {
    if (!this.scene || !this.targetDealer) throw new Error();
    const target = this.targetDealer.get(this.scene);
    if (!target)
      return this.getMuzzleTransform(name).globalize(
        Matrix.translation({ x: 1, y: 0 })
      );

    return target.getGlobal();
  }
}

/**
 * Fire bullets with Guntree.
 */
export class GunTreeWeapon<T, A> {
  /** Events. */
  public readonly event = new EventEmitter<{
    fired: [T, A];
    finished: [T];
  }>();

  private readonly player = new gt.Player();
  private scene?: T;
  private bulletGenerator?: BulletGenerator<T, A>;
  private damageDealerInner?: DamageDealer<T>;

  constructor() {
    this.player.events.on("fired", (data, bullet) => {
      if (!this.scene || !this.bulletGenerator || !this.damageDealerInner)
        throw new Error();
      const bulletActor = this.generateBullet(data, bullet);
      if (!bulletActor) return;
      this.event.emit("fired", this.scene, bulletActor);
    });
    this.player.events.on("finished", () => {
      if (!this.scene) throw new Error();
      this.event.emit("finished", this.scene);
    });
  }

  /**
   * Start firing.
   *
   * @param args Arguments for firing.
   * @param args.scene Scene.
   * @param args.guntree Using Guntree gun.
   * @param args.muzzles Muzzle transformations.
   * @param args.bulletGenerator Generator used when fired.
   * @param args.damageDealer Damage dealer would be emitted by bullet DamageDealer.
   */
  start(args: {
    scene: T;
    guntree: gt.Gun;
    muzzles: Map<string, Transformation>;
    bulletGenerator: BulletGenerator<T, A>;
    targetDealer: TargetDealer<T>;
    damageDealer: DamageDealer<T>;
  }): void {
    if (this.player.isRunning()) return;

    this.scene = args.scene;
    this.bulletGenerator = args.bulletGenerator;
    this.damageDealerInner = args.damageDealer;

    const owner = new GuntreeOwner<T>(
      args.scene,
      args.muzzles,
      args.targetDealer
    );
    this.player.start(true, owner, args.guntree);
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
  stop(): void {
    this.player.requestStop();
  }

  /**
   * Stop firing process immediately.
   */
  forceStop(): void {
    this.player.forceStop();
  }

  /**
   * Update firing process.
   *
   * @param _scene Scene.
   * @param deltaSec Delta seconds.
   */
  update(scene: T, deltaSec: number): void {
    this.scene = scene;
    this.player.update(deltaSec);
  }

  private generateBullet(data: gt.FireData, _bullet: gt.Bullet): A | undefined {
    if (!this.scene || !this.bulletGenerator) throw new Error();
    return this.bulletGenerator.generate(
      this.scene,
      this,
      Matrix.from(data.transform),
      data.elapsedSec,
      data.parameters,
      data.texts
    );
  }
}