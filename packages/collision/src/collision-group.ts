/**
 * CollisionGroup.
 *
 * If ((alpha.mask & beta.category) !== 0), alpha can not collide with beta.
 * Nevertheless if ((beta.mask & alpha.category) !== 0), beta can collide with alpha.
 */
export interface CollisionGroup {
  readonly category: number;
  readonly mask: number;
}

const constructCollisionGroup = (): {
  nothing: CollisionGroup;
  all: CollisionGroup;
  player: CollisionGroup;
  enemy: CollisionGroup;
  playerBullet: CollisionGroup;
  enemyBullet: CollisionGroup;
  item: CollisionGroup;
  terrain: CollisionGroup;
  playerSensor: CollisionGroup;
} => {
  const nothing = 2 ** 0;
  const all = 2 ** 1;
  const player = 2 ** 2;
  const enemy = 2 ** 3;
  const playerBullet = 2 ** 4;
  const enemyBullet = 2 ** 5;
  const item = 2 ** 6;
  const terrain = 2 ** 7;
  const playerSensor = 2 ** 8;

  return {
    nothing: {
      category: nothing,
      mask: 0,
    },
    all: {
      category: all,
      mask: all + player + enemy + playerBullet + item + terrain + playerSensor,
    },
    player: {
      category: player,
      mask: enemy + enemyBullet + terrain,
    },
    enemy: {
      category: enemy,
      mask: player + playerBullet + terrain,
    },
    playerBullet: {
      category: playerBullet,
      mask: enemy + terrain,
    },
    enemyBullet: {
      category: enemyBullet,
      mask: player + terrain,
    },
    item: {
      category: item,
      mask: player + terrain,
    },
    terrain: {
      category: terrain,
      mask: player + playerBullet + enemy + enemyBullet + terrain,
    },
    playerSensor: {
      category: playerSensor,
      mask: player,
    },
  };
};

/**
 * CollisionGroup presets.
 */
export const CollisionGroupPresets: {
  readonly nothing: CollisionGroup;
  readonly all: CollisionGroup;
  readonly player: CollisionGroup;
  readonly enemy: CollisionGroup;
  readonly playerBullet: CollisionGroup;
  readonly enemyBullet: CollisionGroup;
  readonly item: CollisionGroup;
  readonly terrain: CollisionGroup;
  readonly playerSensor: CollisionGroup;
} = constructCollisionGroup();
