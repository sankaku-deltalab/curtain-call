import { CollisionGroup } from "@curtain-call/entity";
import { CollisionModifyService } from "../collision-modify-service";
import { Collision, CollisionShape } from "../collision";

/**
 * Player want to modify collision.
 */
export class CollisionModifyServiceImpl implements CollisionModifyService {
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
  ): void {
    collision.init(args);
  }

  /**
   * Enable collision.
   *
   * @param collision Target collision.
   */
  enableCollision(collision: Collision): void {
    collision.enable();
  }

  /**
   * Enable collision.
   *
   * @param collision Target collision.
   */
  disableCollision(collision: Collision): void {
    collision.disable();
  }
}
