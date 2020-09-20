import { VectorLike, Matrix } from "trans-vector2d";
import { IActor, World } from "@curtain-call/actor";
import { Weapon } from "../weapon";

export interface BulletStyle {
  spriteSize: VectorLike;
  collisionSize: VectorLike;
  texture: PIXI.Texture;
}

export interface BulletGenerator {
  generate(
    world: World,
    weapon: Weapon,
    trans: Matrix,
    elapsedSec: number,
    params: Map<string, number>,
    texts: Map<string, string>
  ): IActor | undefined;
}
