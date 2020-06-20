import { Matrix } from "trans-vector2d";
import { BulletGenerator, GuntreeWeapon } from "@curtain-call/weapon";
import { World } from "@curtain-call/world";
import { SimpleBullet } from "./simple-bullet";

/**
 * Deal given `SimpleBullet`s and reuse them.
 */
export class SimpleBulletGenerator<TWorld extends World = World>
  implements BulletGenerator<TWorld, SimpleBullet<TWorld>> {
  private readonly usedBullets: SimpleBullet<TWorld>[] = [];

  /**
   * @param bullets Bullets used in this generator
   */
  constructor(private readonly bullets: SimpleBullet<TWorld>[]) {}

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
    world: TWorld,
    weapon: GuntreeWeapon<TWorld, SimpleBullet<TWorld>>,
    trans: Matrix,
    elapsedSec: number,
    params: Map<string, number>,
    texts: Map<string, string>
  ): SimpleBullet<TWorld> | undefined {
    this.reuseBullets();

    const bullet = this.bullets.pop();
    if (!bullet) return undefined;

    bullet.damageDealer.chainedFrom(weapon.damageDealer);
    bullet.event.once("removedFromWorld", () => {
      this.usedBullets.push(bullet);
    });

    const speed = params.get("speed") || 1;
    const movedTrans = trans.globalize(
      Matrix.from({ translation: { x: speed * elapsedSec, y: 0 } })
    );
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
      bullet.damageDealer.event.removeAllListeners();
      bullet.event.removeAllListeners();
      this.bullets.push(bullet);
    });
  }
}
