import { VectorLike, Matrix } from "trans-vector2d";
import { IActor, World } from "@curtain-call/actor";

export interface BulletStyle {
  spriteSize: VectorLike;
  collisionSize: VectorLike;
  texture: PIXI.Texture;
}

export interface BulletGenerator {
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
  ): IActor | undefined;
}
