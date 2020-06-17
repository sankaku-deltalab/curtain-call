import { VectorLike, Matrix } from "trans-vector2d";
import { GuntreeWeapon } from "./guntree-weapon";

export interface BulletStyle {
  spriteSize: VectorLike;
  collisionSize: VectorLike;
  texture: PIXI.Texture;
}

export interface BulletGenerator<T, A> {
  generate(
    world: T,
    weapon: GuntreeWeapon<T, A>,
    trans: Matrix,
    elapsedSec: number,
    params: Map<string, number>,
    texts: Map<string, string>
  ): A | undefined;
}
