import { Matrix } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";

export type Box2d = [number, number, number, number];

export interface EventEmitter<T extends Record<string, unknown[]>> {
  emit<V extends keyof T>(name: V, ...args: T[V]): void;
  on<V extends keyof T>(name: V, cb: (...args: T[V]) => void): void;
  off<V extends keyof T>(name: V, cb: (...args: T[V]) => void): void;
}

/**
 * CollisionGroup.
 *
 * If ((alpha.mask & beta.category) !== 0), alpha can collide with beta.
 * Nevertheless if ((beta.mask & alpha.category) === 0), beta can not collide with alpha.
 */
export type CollisionGroup = Readonly<{
  category: number;
  mask: number;
}>;

/**
 * `CollisionShape` express global collision shape.
 */
export interface CollisionShape {
  /**
   * Calculate collision boxes.
   *
   * @param parentTransform Global transformation matrix of parent.
   */
  calcCollisionBox2ds(parentTransform: Matrix): readonly Box2d[];
}

export type CollisionEvent = { overlap: [readonly ActorId[]] };

export type CollisionState = Readonly<{
  shapes: readonly CollisionShape[];
  group: CollisionGroup;
  isExcess: boolean;
  enable: boolean;
  eventEmitter: EventEmitter<CollisionEvent>;
}>;

export interface CollisionStorage {
  addCollision(actorId: ActorId, state: CollisionState): void;
  deleteCollision(actorId: ActorId): void;
  updateCollision(actorId: ActorId, state: CollisionState): void;
  getCollision(actorId: ActorId): Readonly<CollisionState>;
  getCollisions(
    actorIds: readonly ActorId[]
  ): Map<ActorId, Readonly<CollisionState>>;
}
