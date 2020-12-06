import { CollisionGroup } from "@curtain-call/entity";
import { Collision, CollisionShape } from "./collision";

/**
 * Player want to modify collision.
 */
export interface CollisionModifyService {
  /**
   * Initialize collision.
   *
   * @param collision Target collision.
   * @param args Initializing param.
   */
  initCollision(
    collision: Collision,
    args: {
      shapes: CollisionShape[];
      group: CollisionGroup;
      isExcess: boolean;
    }
  ): void;

  /**
   * Enable collision.
   *
   * @param collision Target collision.
   */
  enableCollision(collision: Collision): void;

  /**
   * Enable collision.
   *
   * @param collision Target collision.
   */
  disableCollision(collision: Collision): void;
}
