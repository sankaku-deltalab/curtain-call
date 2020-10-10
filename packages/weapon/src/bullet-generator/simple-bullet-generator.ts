import { Matrix } from "trans-vector2d";
import { IActor, World } from "@curtain-call/actor";
import { BulletGenerator } from "../bullet-generator";
import { SimpleBullet } from "./simple-bullet";

/**
 * Deal given `SimpleBullet`s and reuse them.
 *
 * @example
 * const generator = new SimpleBulletGenerator(
 *   new Array(10).fill(0).map(() => new Actor().addExtension(new SimpleBullet()))
 * );
 */
export class SimpleBulletGenerator implements BulletGenerator {
  private usedBullets: IActor[] = [];
  private readonly actors: IActor[];

  /**
   * @param actors Actors contains SimpleBullet extension. Actors would be used in this generator.
   */
  constructor(actors: readonly IActor[]) {
    this.actors = Array.from(actors);
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
      this.usedBullets.push(actor);
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
    const actor = this.actors.pop();
    if (!actor) return undefined;
    const bullet = actor.getOneExtension(SimpleBullet.isSimpleBullet);
    if (!bullet)
      throw new Error("Actor don't have SINGLE SimpleBullet extension");

    return {
      bullet,
      actor: actor,
    };
  }

  private reuseBullets(): void {
    this.usedBullets.forEach((ac) => {
      const bullet = ac.getOneExtension(SimpleBullet.isSimpleBullet);
      if (!bullet)
        throw new Error("Actor don't have SINGLE SimpleBullet extension");
      bullet.clearSelfForReuse();
      this.actors.push(ac);
    });

    this.usedBullets = [];
  }
}
