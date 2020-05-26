import { VectorLike, Matrix } from "trans-vector2d";
import { GunTreeWeapon } from "./guntree-weapon";

export interface BulletStyle {
  spriteSize: VectorLike;
  collisionSize: VectorLike;
  texture: PIXI.Texture;
}

export interface BulletGenerator<T, A> {
  generate(
    world: T,
    weapon: GunTreeWeapon<T, A>,
    trans: Matrix,
    elapsedSec: number,
    params: Map<string, number>,
    texts: Map<string, string>
  ): A | undefined;
}
