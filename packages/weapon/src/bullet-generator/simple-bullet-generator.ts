import { Matrix } from "trans-vector2d";
import { IActor, World } from "@curtain-call/actor";
import { BulletGenerator } from "../bullet-generator";
import { SimpleBullet } from "./simple-bullet";

/**
 * Deal given `SimpleBullet`s and reuse them.
 *
 * @example
 * const generator = new SimpleBulletGenerator(
 *   new Array(10).fill(0).map(() => [new SimpleBullet(), new Actor()])
 * );
 */
export class SimpleBulletGenerator implements BulletGenerator {
  private readonly bullets: SimpleBullet[];
  private usedBullets: SimpleBullet[] = [];
  private readonly actors: Map<SimpleBullet, IActor>;

  /**
   * @param bullets Bullets used in this generator
   */
  constructor(bullets: readonly [SimpleBullet, IActor][]) {
    this.bullets = bullets.map(([b]) => b);
    this.actors = new Map(bullets);
    bullets.forEach(([b, a]) => a.addExtension(b));
  }

  /**
   * Generate bullet.
   *
   * @param world World.
   * @param damageParent Damage dealer using bullet.
   * @param trans Bullet spawning transform.
   * @param elapsedSec Elapsed time from fired.
   * @param params Real parameters.
   * @param texts String parameters.
   * @returns Bullet.
   */
  generate(
    world: World,
    damageParent: IActor,
    trans: Matrix,
    elapsedSec: number,
    params: Map<string, number>,
    texts: Map<string, string>
  ): IActor | undefined {
    this.reuseBullets();

    const bulletAndActor = this.popBullet();
    if (!bulletAndActor) return undefined;
    const { bullet, actor } = bulletAndActor;

    actor.event.on("dealDamage", (wold, damage, victim, damageType) =>
      damageParent.notifyDealtDamage(wold, damage, victim, damageType)
    );
    actor.event.on("killed", (wold, victim, damageType) =>
      damageParent.notifyKilled(wold, victim, damageType)
    );

    actor.event.once("removedFromWorld", () => {
      this.usedBullets.push(bullet);
    });

    const speed = params.get("speed") || 1;
    const movedTrans = trans.globalize(
      Matrix.from({ translation: { x: speed * elapsedSec, y: 0 } })
    );
    actor
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
    world.addActor(actor);

    return actor;
  }

  private popBullet(): { bullet: SimpleBullet; actor: IActor } | undefined {
    const bullet = this.bullets.pop();
    if (!bullet) return undefined;

    return {
      bullet,
      actor: this.getActorFor(bullet),
    };
  }

  private getActorFor(bullet: SimpleBullet): IActor {
    const actor = this.actors.get(bullet);
    if (!actor) throw new Error("Actor for bullet is not found");
    return actor;
  }

  private reuseBullets(): void {
    this.usedBullets.forEach((bullet) => {
      bullet.clearSelfForReuse();
      this.bullets.push(bullet);
    });

    this.usedBullets = [];
  }
}
