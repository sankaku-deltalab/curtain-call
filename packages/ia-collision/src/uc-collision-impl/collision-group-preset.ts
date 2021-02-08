type PresetKey =
  | "player"
  | "playerBullet"
  | "enemy"
  | "enemyBullet"
  | "wall"
  | "item";

const category: Record<PresetKey, number> = {
  player: 2 ** 1,
  playerBullet: 2 ** 2,
  enemy: 2 ** 3,
  enemyBullet: 2 ** 4,
  wall: 2 ** 5,
  item: 2 ** 6,
} as const;

const mask: Record<PresetKey, number> = {
  player: category.enemy + category.enemyBullet + category.wall + category.item,
  playerBullet: category.enemy + category.wall,
  enemy: category.player + category.playerBullet + category.wall,
  enemyBullet: category.player + category.wall,
  wall:
    category.player +
    category.playerBullet +
    category.enemy +
    category.enemyBullet,
  item: category.player,
} as const;

export const collisionGroupPreset = {
  player: { category: category.player, mask: mask.player },
  playerBullet: { category: category.playerBullet, mask: mask.playerBullet },
  enemy: { category: category.enemy, mask: mask.enemy },
  enemyBullet: { category: category.enemyBullet, mask: mask.enemyBullet },
  wall: { category: category.wall, mask: mask.wall },
  item: { category: category.item, mask: mask.item },
} as const;
