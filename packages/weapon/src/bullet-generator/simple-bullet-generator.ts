import { Matrix } from "trans-vector2d";
import { World } from "@curtain-call/actor";
import { BulletGenerator } from "../bullet-generator";
import { Weapon } from "../weapon";
import { SimpleBullet } from "./simple-bullet";

/**
 * Deal given `SimpleBullet`s and reuse them.
 */
export class SimpleBulletGenerator implements BulletGenerator {
  private usedBullets: SimpleBullet[] = [];

  /**
   * @param bullets Bullets used in this generator
   */
  constructor(private readonly bullets: SimpleBullet[]) {}

  /**
   * Generate bullet.
   *
   * @param world World.
   * @param weapon Weapon request bullet.
   * @param trans Bullet spawning transform.
   * @param elapsedSec Elapsed time from fired.
   * @param params Real parameters.
   * @param texts String parameters.
   * @returns Bullet.
   */
  generate(
    world: World,
    weapon: Weapon,
    trans: Matrix,
    elapsedSec: number,
    params: Map<string, number>,
    texts: Map<string, string>
  ): SimpleBullet | undefined {
    this.reuseBullets();

    const bullet = this.bullets.pop();
    if (!bullet) return undefined;

    bullet.event.on("dealDamage", (wold, damage, victim, damageType) =>
      weapon.notifyDealtDamage(wold, damage, victim, damageType)
    );
    bullet.event.on("killed", (wold, victim, damageType) =>
      weapon.notifyKilled(wold, victim, damageType)
    );

    bullet.event.once("removedFromWorld", () => {
      this.usedBullets.push(bullet);
    });

    const speed = params.get("speed") || 1;
    const movedTrans = trans.globalize(
      Matrix.from({ translation: { x: speed * elapsedSec, y: 0 } })
    );
    bullet
      .setLocalTransform(movedTrans)
      .setLifeTime(params.get("lifeTime") || 5);
    bullet.init({
      trans: movedTrans,
      speed,
      lifeTimeSec: params.get("lifeTime") || 5,
      damage: params.get("damage") || 1,
      damageName: texts.get("damageName") || "bullet",
      size: params.get("size") || 1,
    });
    world.addActor(bullet);

    return bullet;
  }

  private reuseBullets(): void {
    this.usedBullets.forEach((bullet) => {
      bullet.cancelRemovingSelfFromWorld();
      bullet.event.removeAllListeners("dealDamage");
      this.bullets.push(bullet);
    });

    this.usedBullets = [];
  }
}
